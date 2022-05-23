class CreateUpdates < ActiveRecord::Migration
  def change
    create_table :updates do |t|
      t.integer :user_id
      t.string :title
      t.text :content
      t.string :img

      t.timestamps
    end
  end
end
