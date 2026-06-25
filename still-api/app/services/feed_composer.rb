class FeedComposer
  def self.compose(items)
    return [] if items.empty?
    feed = items.group_by { |item| item.source_id }
    feed.values.first.zip(*feed.values.drop(1)).flatten.compact
  end
end
