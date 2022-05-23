class CreateConfiguration < ActiveRecord::Migration
  def change
    create_table :configurations do |t|
      t.string :key
      t.text :value
      t.timestamps
    end
  end
end
