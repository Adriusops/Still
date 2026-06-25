class RssFetchJob
  include Sidekiq::Worker

  def perform
    sources = Subscription.active.includes(:source).map(&:source).uniq
    sources.each do |source|
      rss_crawler = RssCrawler.new(source)
      rss_crawler.fetch
    end
  end
end
