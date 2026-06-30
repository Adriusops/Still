class Api::V1::ItemsController < ApplicationController
  def index
    items = current_user.items.order(created_at: :desc)
    render json: FeedComposer.compose(items)
  end
end
