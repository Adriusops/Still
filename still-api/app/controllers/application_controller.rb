class ApplicationController < ActionController::API
  before_action :authenticate_user

  def authenticate_user
    token = request.headers["Authorization"]&.split(" ")&.last
    if token
      begin decoded = JsonWebToken.decode(token)

      rescue JWT::DecodeError
        render json: { error: "Unauthorized" }, status: :unauthorized
      else
        @current_user = User.find(decoded[:user_id])
      end
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
