class ApplicationController < ActionController::Base

  private

  def authenticate_developer
    unless Rails.env == 'production'
      authenticate_or_request_with_http_basic 'Please prove that you are a developer!' do |name, password|
        name == 'themathist-dev' && password == '%Prefekt#1'
      end
    end
  end
end
