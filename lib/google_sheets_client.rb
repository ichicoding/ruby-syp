# app/services/google_sheets_client.rb

require 'google/apis/sheets_v4'
require 'googleauth'

class GoogleSheetsClient
  SHEETS_API = Google::Apis::SheetsV4::SheetsService.new

  # Initialize with Google API credentials
  def initialize
    scope = Google::Apis::SheetsV4::AUTH_SPREADSHEETS 
    authorization = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: File.open('config/ruby-rails-integration-01a9ad65ee8c.json'), 
      scope: scope
    )
    SHEETS_API.authorization = authorization
  end

  def fetch_products
    spreadsheet_id = '13wrNajdcH2QkhEJy2foDbAJYbPb4_G6An8ZS_YjMKf0' # Your actual spreadsheet ID
    range = 'products!A2:D' # Fetch from the 'products' sheet, columns A to D starting from row 2
    response = SHEETS_API.get_spreadsheet_values(spreadsheet_id, range)
    response.values.map do |row| 
      { 
        product: row[0],           # Column A: product
        available: row[1].to_i,    # Column B: available (converted to integer)
        base_price: row[2].to_f,   # Column C: base_price (converted to float)
        mill: row[3]               # Column D: mill
      }
    end
  end

  def fetch_freight
    spreadsheet_id = '13wrNajdcH2QkhEJy2foDbAJYbPb4_G6An8ZS_YjMKf0' # Your actual spreadsheet ID
    range = 'freight!A2:C' # Fetch from the 'freight' sheet, columns A to C starting from row 2
    response = SHEETS_API.get_spreadsheet_values(spreadsheet_id, range)
    response.values.map do |row| 
      { 
        destination: row[0].strip,  # Column A: destination, stripping extra whitespace
        freight_costs: row[1].gsub(/[^\d\.]/, '').to_f,  # Remove all non-numeric characters except the dot and convert to float
        mill: row[2].strip  # Column C: mill, stripping extra whitespace
      }
    end
  end  
end
