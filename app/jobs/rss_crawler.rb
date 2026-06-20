require "net/http"
require "uri"

class RssCrawler
  def initialize(source)
    @source = source
  end

  def fetch
    uri = URI(@source.url)
    use_ssl = (uri.scheme == "https")

    request = Net::HTTP::Get.new(uri.request_uri)

    request["If-None-Match"] = @source.etag if @source.etag
    request["If-Modified-Since"] = @source.last_modified if @source.last_modified

    response = Net::HTTP.start(uri.host, uri.port, use_ssl: use_ssl) do |http|
      http.request(request)
    end

    return if response.code == "304"

    @feed = Feedjira.parse(response.body)
    @source.update(name: @feed.title, etag: response["ETag"], last_modified: response["Last-Modified"])


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
