class User < ActiveRecord::Base
    has_many :feedbacks
    has_many :demo_requests, inverse_of: :user

    after_create :send_welcome_email

    def send_welcome_email
        UserMailer.welcome_email(self).deliver_later
    end
end
