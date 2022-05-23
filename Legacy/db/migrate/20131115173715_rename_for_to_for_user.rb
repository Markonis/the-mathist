class RenameForToForUser < ActiveRecord::Migration
  def change
    rename_column :updates, :for, :for_user
  end
end
