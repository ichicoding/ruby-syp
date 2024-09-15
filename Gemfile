source "https://rubygems.org"

gem "rails", "~> 7.2.1"
gem "pg", "~> 1.1"

# Gems for accessing Google Sheets API
gem 'googleauth', '~> 0.17.0' # For Google API authentication
gem 'google-apis-sheets_v4', '~> 0.15.0' # For Google Sheets API access

gem 'rack-cors' # Use Rack CORS for handling Cross-Origin Resource Sharing

# Use the Puma web server
gem "puma", ">= 5.0"

# Uncomment this if you need to build JSON APIs
# gem "jbuilder"

# Uncomment and configure these gems if needed
# gem "redis", ">= 4.0.1"
# gem "kredis"
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[windows jruby]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Uncomment this if you need Active Storage image processing
# gem "image_processing", "~> 1.2"

group :development, :test do
  # Debugging gem
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"

  # Static analysis for security vulnerabilities
  gem "brakeman", require: false

  # Ruby code style enforcement
  gem "rubocop-rails-omakase", require: false
end
