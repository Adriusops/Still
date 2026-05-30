class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :email, null: false
      t.index :email, unique: true
      t.string :password_digest
      t.jsonb :settings
      t.timestamps
    end
  end
end
