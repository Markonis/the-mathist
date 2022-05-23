class CreateFbnotes < ActiveRecord::Migration
  def change
    create_table :fbnotes do |t|
      t.integer :user_id
      t.string :title
      t.text :content

      t.timestamps
    end
  end
end
