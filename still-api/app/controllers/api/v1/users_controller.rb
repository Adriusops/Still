class Api::V1::UsersController < ApplicationController
  def show
    render json: current_user, only: [ :id, :username, :email ]
  end

  def create
    user = User.create!(username: params[:username], email: params[:email], password: params[:password])
    token = JsonWebToken.encode(user_id: user.id)
    render json: { token: token }, status: :created
  rescue ActiveRecord::RecordInvalid
    render json: { error: "Invalid inputs" }, status: :unprocessable_entity
  end
end
