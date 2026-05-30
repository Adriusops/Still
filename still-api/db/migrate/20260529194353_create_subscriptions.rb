class CreateSubscriptions < ActiveRecord::Migration[8.1]
  def change
    create_table :subscriptions do |t|
      t.timestamps
      t.references :user, null: false, foreign_key: true
      t.references :source, null: false, foreign_key: true
      t.index [:user_id, :source_id], unique: true
      t.datetime :paused_until
      t.string :status, null: false, default: "active"
    end
  end
end
