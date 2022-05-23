class DefaultConfig < ActiveRecord::Migration
  def change
      change_column :users, :config, :string, default: '{}'
  end
end
