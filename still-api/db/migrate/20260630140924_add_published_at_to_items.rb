class AddPublishedAtToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :published_at, :datetime
  end
end
