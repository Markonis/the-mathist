class DropOldTables < ActiveRecord::Migration
  def change
    drop_table :admin_notifications
    drop_table :comments
    drop_table :images
    drop_table :note_media
    drop_table :notes
    drop_table :posts
    drop_table :user_sources
  end
end
