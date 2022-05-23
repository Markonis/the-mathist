class DemoRequest < ActiveRecord::Base
  belongs_to :user, inverse_of: :demo_requests
end
