Rails.application.routes.draw do
  get 'products', to: 'products#index'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  # New route to handle comparing prices between products and print sheets
  get '/deals', to: 'products#compare_prices'

  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
