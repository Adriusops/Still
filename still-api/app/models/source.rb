class Source < ApplicationRecord
  has_many :subscriptions
  has_many :users, through: :subscriptions
  has_many :items
  enum :source_type, [ :article, :podcast, :video ]

  validates :url, presence: true, uniqueness: true
  validates :source_type, presence: true
end
