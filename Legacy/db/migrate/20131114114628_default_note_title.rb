class DefaultNoteTitle < ActiveRecord::Migration
  def change
      change_column :notes, :title, :string, default: 'Untitled'
  end
end
