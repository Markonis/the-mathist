class CreateNoteMedia < ActiveRecord::Migration
  def change
    create_table :note_media do |t|
      t.integer :media_id
      t.integer :note_id

      t.timestamps
    end
  end
end
