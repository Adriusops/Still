class Api::V1::ActivitiesController < ApplicationController
  before_action :authenticate_user

  def create
    activity = Activity.create!(user_id: current_user.id, item_id: params[:item_id], consumed_at: Time.current)
    render json: activity, status: :created
  rescue ActiveRecord::RecordInvalid
    render json: { error: "Item already consumed" }, status: :conflict
  end
end
