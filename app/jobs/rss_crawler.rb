class RssCrawler
  def initialize(source)
    @source = source
  end

  def fetch
    @feed = Feedjira::Feed.fetch_and_parse(@source.url)


    items = @feed.items
    items_type = { "article" => "Article", "podcast" => "Episode", "video" => "Video" }
    items.each do |item|
      Item.find_or_create_by(url: item.url) do |post|
        post.source = @source
        post.url = item.url
        post.title = item.title
        post.type = items_type[@source.source_type]
        post.author = item.author
        post.duration = item.duration
      end
    end
    rescue => exception
      warn exception.message
  end
end
