require "net/http"
require "uri"

class RssCrawler
  def initialize(source)
    @source = source
  end

  def fetch
    uri = URI(@source.url)
    use_ssl = (uri.scheme == "https")

    response = Net::HTTP.start(uri.host, uri.port, use_ssl: use_ssl) do |http|
      http.get(uri.request_uri)
    end

    @feed = Feedjira.parse(response.body)
    @source.update(name: @feed.title)

    items = @feed.entries
    items_type = { "article" => "Article", "podcast" => "Episode", "video" => "Video" }
    items.each do |item|
      Item.find_or_create_by(url: item.url) do |post|
        post.source = @source
        post.url = item.url
        post.title = item.title
        post.type = items_type[@source.source_type]
        post.content = item.summary
        post.duration = item.duration if item.respond_to?(:duration)
      end
    end
    rescue => exception
      warn exception.message
  end
end
