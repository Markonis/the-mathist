class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :mail
      t.string :name
      t.integer :premium
      t.integer :points
      t.string :config
      t.datetime :last_login
      t.integer :provider
      t.string :user_id

      t.timestamps
    end
  end
end
