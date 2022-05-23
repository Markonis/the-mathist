class CreateDemoRequests < ActiveRecord::Migration
  def change
    create_table :demo_requests do |t|
      t.string :name
      t.string :email
      t.string :organization

      t.timestamps null: false
    end
  end
end
