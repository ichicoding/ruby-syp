# app/controllers/sessions_controller.rb
class SessionsController < ApplicationController
  # Hardcoded username and password
  USERS = {
    'admin' => 'pinepounder',
    'employee' => 'pinepounder'
  }

  # POST /login
  def create
    username = params[:username]
    password = params[:password]

    if USERS[username] && USERS[username] == password
      session[:user] = username
      render json: { message: 'Logged in successfully!' }, status: :ok
    else
      render json: { error: 'Unauthorized: Invalid username or password' }, status: :unauthorized
    end
  end

  # DELETE /logout
  def destroy
    session.delete(:user)
    render json: { message: 'Logged out successfully' }, status: :ok
  end
end
