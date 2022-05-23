class DropTableFbnotes < ActiveRecord::Migration
  def up
    drop_table :fbnotes
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
