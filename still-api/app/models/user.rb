class User < ApplicationRecord
  has_secure_password

  has_many :activities
  has_many :subscriptions
  has_many :sources, through: :subscriptions

  validates :email, presence: true, uniqueness: true
end
