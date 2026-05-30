class CreateItems < ActiveRecord::Migration[8.1]
  def change
    create_table :items do |t|
      t.timestamps
      t.string :type, null: false
      t.string :title, null: false
      t.string :url, null: false
      t.index :url, unique: true
      t.string :content
      t.string :image_url
      t.string :author, null: false
      t.integer :duration, null: false
      t.references :source, null: false, foreign_key: true
    end
  end
end
