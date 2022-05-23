class CreateUserSources < ActiveRecord::Migration
  def change
    create_table :user_sources do |t|
      t.string :source
      t.integer :count, :default => 0

      t.timestamps
    end
  end
end
