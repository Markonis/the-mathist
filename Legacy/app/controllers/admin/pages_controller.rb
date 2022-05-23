class Admin::PagesController < Admin::BaseController
  #GET /admin
  def index
    @users_count = User.count
    @wa_credits = Setting.get_single_value 'wa_credits'
  end
end
