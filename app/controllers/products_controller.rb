# app/controllers/products_controller.rb
require 'google_sheets_client'

class ProductsController < ApplicationController
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

        # Create a list of results with all matching options
        results = matched_products.map do |p|
          matching_freights = filtered_freights.select { |f| f[:mill] == p[:mill] }
          next if matching_freights.empty?

          matching_freights.map do |f|
            {
              product: p[:product],
              total_price: p[:base_price].to_f + f[:freight_cost].to_f,
              mill: p[:mill]
            }
          end
        end.flatten.compact

        # Sort results by total price
        sorted_results = results.sort_by { |r| r[:total_price] }

        # Return all sorted options
        render json: { results: sorted_results }
      else
        # Return unique lists of products and destinations
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
      logger.error e.backtrace.join("\n")
      render json: { error: "An unexpected error occurred." }, status: :internal_server_error
    end
  end
end
