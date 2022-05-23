class ChangeNoteMediaHashToUid < ActiveRecord::Migration
  def change
      rename_column :note_media, :hash, :uid
  end
end
