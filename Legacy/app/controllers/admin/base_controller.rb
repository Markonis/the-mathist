class Admin::BaseController < ApplicationController
  before_action :authenticate_admin

  private

  def authenticate_admin
    authenticate_or_request_with_http_basic 'Please prove that you are an administrator!' do |name, password|
      name == 'themathist-admin' && password == 'kkc9931&$3911!'
    end
  end
end
