class Admin::UpdatesController < Admin::BaseController
  before_action :set_update, only: [:show, :edit, :update, :destroy]

  # GET /admin/updates
  def index
    @updates = Update.all
  end

  # GET /admin/updates/1
  def show
  end

  # GET /admin/updates/new
  def new
    @update = Update.new
  end

  # GET /admin/updates/1/edit
  def edit
  end

  # POST /admin/updates
  def create
    @update = Update.new(update_params)

    if @update.save
      redirect_to [:admin, @update], notice: 'Update was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /admin/updates/1
  def update
    if @update.update(update_params)
      redirect_to @update, notice: 'Update was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /admin/updates/1
  def destroy
    @update.destroy
    redirect_to admin_updates_url, notice: 'Update was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_update
      @update = Update.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def update_params
      params.require(:update).permit(:user_id, :title, :content, :for_user)
    end
end
