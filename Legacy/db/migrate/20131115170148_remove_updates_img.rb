class RemoveUpdatesImg < ActiveRecord::Migration
  def change
      remove_column :updates, :img
  end
end
