class Item < ApplicationRecord
  belongs_to :source

  validates :url, presence: true, uniqueness: true
  validates :title, presence: true
  validates :source_id, presence: true
end
