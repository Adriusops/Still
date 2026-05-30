class Item < ApplicationRecord
  belongs_to :source

  validates :url, presence: true, uniqueness: true
  validates :title, presence: true
  validates :author, presence: true
  validates :source_id, presence: true
  validates :duration, presence: true
end
