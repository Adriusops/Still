class CreateSources < ActiveRecord::Migration[8.1]
  def change
    create_table :sources do |t|
      t.timestamps
      t.string :name, null: false
      t.string :url, null: false
      t.index :url, unique: true
      t.string :source_type, null: false
      t.string :image_url
    end
  end
end
