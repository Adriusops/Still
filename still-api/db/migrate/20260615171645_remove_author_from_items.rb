class RemoveAuthorFromItems < ActiveRecord::Migration[8.1]
  def change
    remove_column :items, :author, :string
  end
end
