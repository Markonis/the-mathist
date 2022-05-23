class UpdatesFor < ActiveRecord::Migration
  def change
      add_column :updates, :for, :integer
  end
end
