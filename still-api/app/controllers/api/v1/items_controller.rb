class Api::V1::ItemsController < ApplicationController
  def index
    render json: FeedComposer.compose(current_user.items)
  end
end
