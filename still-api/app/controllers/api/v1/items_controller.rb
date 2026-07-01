class Api::V1::ItemsController < ApplicationController
  def index
      items = current_user.items.includes(:source).order(created_at: :asc)
      render json: FeedComposer.compose(items).map { |i|
        i.as_json.merge(
          type: i.type,
          source_name: i.source.name
        )
      }
    end

end
