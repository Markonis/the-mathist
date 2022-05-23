class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.integer :user_id
      t.text :title
      t.text :content
      t.integer :for
      t.integer :rating

      t.timestamps
    end
  end
end
