class DeleteForInPosts < ActiveRecord::Migration
  def change
      remove_column :posts, :for
  end
end
