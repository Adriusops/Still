class Api::V1::ItemsController < ApplicationController
  def index
    render json: current_user.items
  end
end
