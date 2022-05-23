class Admin::SettingsController < Admin::BaseController
  before_action :set_setting, only: [:show, :edit, :update, :destroy]

  # GET /admin/settings
  def index
    @settings = Setting.all
  end

  # GET /admin/settings/1
  def show
  end

  # GET /admin/settings/new
  def new
    @setting = Setting.new
  end

  # GET /admin/settings/1/edit
  def edit
  end

  # POST /admin/settings
  def create
    @setting = Setting.new(setting_params)

    if @setting.save
      redirect_to [:admin, @setting], notice: 'Setting was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /admin/settings/1
  def update
    if @setting.update(setting_params)
      redirect_to admin_settings_url, notice: 'Setting was successfully settingd.'
    else
      render action: 'edit'
    end
  end

  # DELETE /admin/settings/1
  def destroy
    @setting.destroy
    redirect_to admin_settings_url, notice: 'Setting was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_setting
      @setting = Setting.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def setting_params
      params.require(:setting).permit(:key, :value)
    end
end
