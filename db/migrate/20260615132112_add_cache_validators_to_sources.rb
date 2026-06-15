class AddCacheValidatorsToSources < ActiveRecord::Migration[8.1]
  def change
    add_column :sources, :etag, :string
    add_column :sources, :last_modified, :string
  end
end
