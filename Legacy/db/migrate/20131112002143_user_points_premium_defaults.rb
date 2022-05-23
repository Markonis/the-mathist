class UserPointsPremiumDefaults < ActiveRecord::Migration
  def change
      change_column :users, :points, :integer, default: 0
      change_column :users, :premium, :integer, default: 0
  end
end
