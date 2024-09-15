require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module LumberApp
  class Application < Rails::Application
    # Other configuration...

    # Add this CORS configuration block
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'http://localhost:3001' # Replace with the correct origin(s)
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head]
      end
    end
  end
end