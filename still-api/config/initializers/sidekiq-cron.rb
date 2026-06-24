Sidekiq.configure_server do |config|
  config.on(:startup) do
    Sidekiq::Cron::Job.create(
      name: "rss_fetch",
      cron: "0 */1 * * *",
      class: "RssFetchJob"
    )
  end
end
