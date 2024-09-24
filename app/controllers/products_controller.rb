# app/controllers/products_controller.rb
require 'google_sheets_client'

class ProductsController < ApplicationController
  # Existing index method for previous calculations
  def index
    begin
      client = GoogleSheetsClient.new
      products = client.fetch_products  # Fetches data from the 'products' sheet
      freight_data = client.fetch_freight  # Fetches data from the 'freight' sheet

      product = params[:product]
      destination = params[:destination]

      if product.present? && destination.present?
        # Filter the products by the selected product
        matched_products = products.select { |p| p[:product] == product }

        # Filter freight data by the selected destination
        filtered_freights = freight_data.select { |f| f[:destination] == destination }

        results = matched_products.map do |p|
          # Match the freights by mill
          matching_freights = filtered_freights.select { |f| f[:mill] == p[:mill] }
          next if matching_freights.empty?

          # Find the minimum freight cost
          min_freight = matching_freights.min_by { |f| f[:freight_costs].to_f }

          {
            product: p[:product],
            available: p[:available],
            base_price: p[:base_price].to_f,
            freight_costs: min_freight[:freight_costs].to_f,
            mill: p[:mill],
            total_price: p[:base_price].to_f + min_freight[:freight_costs].to_f # Calculated total price
          }
        end.compact

        # Sort the results by total_price in ascending order
        sorted_results = results.sort_by { |r| r[:total_price] }

        if sorted_results.any?
          render json: sorted_results # Always return an array if there are results
        else
          render json: [] # Return an empty array instead of an error message
        end
      else
        # If no specific product or destination is selected, return unique lists
        render json: {
          products: products.map { |p| p[:product] }.uniq,
          destinations: freight_data.map { |f| f[:destination] }.uniq
        }
      end

    rescue Google::Apis::Error => e
      logger.error "Failed to fetch data from Google Sheets: #{e.message}"
      render json: { error: "Unable to fetch data from Google Sheets." }, status: :internal_server_error
    rescue => e
      logger.error "An unexpected error occurred: #{e.message}"
      logger.error e.backtrace.join("\n") # Log the full backtrace for debugging
      render json: { error: "An unexpected error occurred." }, status: :internal_server_error
    end
  end

  # New method for comparing prices between products and print sheets
  def compare_prices
    begin
      client = GoogleSheetsClient.new
      # Fetch data independently from the 'products' and 'print' sheets
      products_data = client.fetch_products # Fetch data from 'products' sheet
      print_data = client.fetch_print_data  # Fetch data from 'print' sheet

      # Prepare results array
      deals = []

      # Compare prices based on product and zone
      products_data.each do |product|
        # Convert text to lowercase and trim extra spaces
        product_name = product[:product]&.strip&.downcase
        product_zone = product[:zone]&.strip&.downcase
        product_base_price = product[:base_price]&.to_f

        # Check for undefined or empty values
        next if product_name.blank? || product_zone.blank? || product_base_price.nil?

        # Find matching product in print data with the same name and zone
        matching_print = print_data.find do |p|
          p_name = p[:product]&.strip&.downcase
          p_zone = p[:zone]&.strip&.downcase
          p_name == product_name && p_zone == product_zone
        end

        # Continue if no match found or if print price is undefined
        next if matching_print.nil? || matching_print[:base_price].nil?

        print_base_price = matching_print[:base_price].to_f

        # Compare prices and add to deals if product price is less
        if product_base_price < print_base_price
          price_difference = print_base_price - product_base_price
          deals << {
            product: product[:product],
            zone: product[:zone],
            product_base_price: product_base_price,
            print_base_price: print_base_price,
            available_units: product[:available],
            mill: product[:mill],
            price_difference: price_difference # Add price difference to the results
          }
        end
      end

      # Return the matching deals
      if deals.empty?
        render json: { message: "No deals available at the moment." }
      else
        render json: deals
      end

    rescue Google::Apis::Error => e
      logger.error "Failed to fetch data from Google Sheets: #{e.message}"
      render json: { error: "Unable to fetch data from Google Sheets." }, status: :internal_server_error
    rescue StandardError => e
      logger.error "An unexpected error occurred: #{e.message}"
      logger.error e.backtrace.join("\n")
      render json: { error: "An unexpected error occurred on the server." }, status: :internal_server_error
    end
  end
end
