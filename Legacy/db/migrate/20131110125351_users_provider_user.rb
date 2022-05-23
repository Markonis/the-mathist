class UsersProviderUser < ActiveRecord::Migration
  def change
    rename_column :users, :user_id, :provider_user
  end
end
