class AllowNullDurationOnItems < ActiveRecord::Migration[8.1]
  def change
    change_column_null :items, :duration, true
  end
end
