class Api::V1::SourcesController < ApplicationController
  before_action :set_source, only: [ :update ]

  def index
    render json: current_user.sources
  end

  def create
    source = Source.find_or_create_by(url: source_params[:url])
    render json: current_user.subscriptions.create(source: source)
    rescue SOURCE::DecodeError
      render json: { error: "Failed" }, status: :Failed
  end

  def update
    @source.update(source_params)
    render json: @source
  end

  private
  def set_source
    @source = current_user.sources.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Source not found" }, status: :not_found
  end

  def source_params
    params.require(:source).permit(:url)
  end
end
