class CreateAdminNotifications < ActiveRecord::Migration
  def change
    create_table :admin_notifications do |t|
      t.integer :reason
      t.boolean :seen

      t.timestamps
    end
  end
end
