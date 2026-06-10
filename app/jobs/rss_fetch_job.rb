class RssFetchJob
  include Sidekiq::Worker

  def perform (source_id)
    source = Source.find(source_id)
    rss_crawler = RssCrawler.new(source)
    rss_crawler.fetch
  end
end
