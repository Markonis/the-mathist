class UserMailer < ApplicationMailer
  default from: 'contact@themathist.com'

  def welcome_email(user)
    @user = user
    mail(to: @user.mail, subject: 'Welcome to The Mathist')
  end
end
