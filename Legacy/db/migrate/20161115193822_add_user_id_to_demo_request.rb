class AddUserIdToDemoRequest < ActiveRecord::Migration
  def change
    add_reference :demo_requests, :user, index: true, foreign_key: true
  end
end
