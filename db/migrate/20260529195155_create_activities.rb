class CreateActivities < ActiveRecord::Migration[8.1]
  def change
    create_table :activities do |t|
      t.timestamps
      t.references :user, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true
      t.datetime :consumed_at
    end
  end
end
