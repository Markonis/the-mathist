class AddDriveRequestsCountToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :drive_requests_count, :integer, default: 0
  end
end
