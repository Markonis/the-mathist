class AddHashToNoteMedia < ActiveRecord::Migration
  def change
      add_column :note_media, :hash, :text
  end
end
