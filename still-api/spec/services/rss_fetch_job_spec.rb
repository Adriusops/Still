require 'rails_helper'

RSpec.describe RssFetchJob do
  context "2 active subscriptions with 2 different sources" do
    let(:user1) { User.create!(email: "user1@example.com", password: "password", username: "user1") }
    let(:user2) { User.create!(email: "user2@example.com", password: "password", username: "user2") }
    let(:source1) { Source.create!(url: "https://example.com/rss1", source_type: "article", name: "test1") }
    let(:source2) { Source.create!(url: "https://example.com/rss2", source_type: "article", name: "test2") }
    let!(:subscription1) { Subscription.create!(user: user1, source: source1, status: "active") }
    let!(:subscription2) { Subscription.create!(user: user2, source: source2, status: "active") }

    it "RssCrawler called 2 times, 1 time per source" do
      expect(RssCrawler).to receive(:new).with(source1).once.and_return(double(fetch: nil))
      expect(RssCrawler).to receive(:new).with(source2).once.and_return(double(fetch: nil))
      RssFetchJob.new.perform
    end
  end

  context "2 active subscriptions with same source" do
    let(:user1) { User.create!(email: "user1@example.com", password: "password", username: "user1") }
    let(:user2) { User.create!(email: "user2@example.com", password: "password", username: "user2") }
    let(:source) { Source.create!(url: "https://example.com/rss1", source_type: "article", name: "test1") }
    let!(:subscription1) { Subscription.create!(user: user1, source: source, status: "active") }
    let!(:subscription2) { Subscription.create!(user: user2, source: source, status: "active") }

    it "RssCrawler called once" do
      expect(RssCrawler).to receive(:new).with(source).once.and_return(double(fetch: nil))
      RssFetchJob.new.perform
    end
  end
end
