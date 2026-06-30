require "net/http"
require "uri"

class RssCrawler
  def initialize(source)
    @source = source
  end

  def fetch
    if items_type[@source.source_type].nil?
      Rails.logger.error("Invalid source type: #{@source.source_type} for source #{@source.id}")
      return
    end

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
    items.each do |item|
      Item.find_or_create_by(url: item.url) do |post|
        post.source = @source
        post.url = item.url
        post.image_url = item.image if item.respond_to?(:image)
        post.title = item.title
        post.type = items_type[@source.source_type]
        post.published_at = item.published if item.respond_to?(:published)
        post.content = item.summary
        post.duration = item.duration if item.respond_to?(:duration)
      end
    end
  rescue => exception
    warn exception.message
  end
  private
  def items_type
    { "article" => "Article", "podcast" => "Episode", "video" => "Video" }
  end
end
