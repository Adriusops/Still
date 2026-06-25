class Subscription < ApplicationRecord
  belongs_to :user
  belongs_to :source

  validates :user_id, uniqueness: { scope: :source_id }
  validate :cannot_exceed_source_limit

  scope :active, -> { where(status: :active) }

  private

  def cannot_exceed_source_limit
    if user.subscriptions.active.count >= 10
      errors.add(:base, "Cannot have more than 10 active sources")
    end
  end
end
