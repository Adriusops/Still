require 'rails_helper'

RSpec.describe RssCrawler do
  let(:source) { Source.create!(etag: nil, last_modified: nil, url: "https://example.com/rss", source_type: "article", name: "test") }

  let(:body) do
    <<~XML
    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Test Feed</title>
      <entry>
        <title>Test Article</title>
        <link href="https://example.com/article-1"/>
        <id>https://example.com/article-1</id>
        <updated>2026-01-01T00:00:00Z</updated>
      </entry>
    </feed>
    XML
  end

  context "quand la réponse est 200 et que l'item est créé" do
    before do
      # 2. Stubber la requête HTTP sortante avec WebMock
      stub_request(:get, "https://example.com/rss").
               with(
                 headers: {
                 'Accept'=>'*/*',
                 'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
                 'User-Agent'=>'Ruby'
                 }).
               to_return(status: 200, body: body, headers: {})
    end

    let(:crawler) { RssCrawler.new(source) }

    it "crée un nouvel item en base" do
      expect { crawler.fetch }.to change(Item, :count).by(1)
    end
  end

  context "quand la réponse est 200 et que l'item est déjà présent en base" do
    before do
      stub_request(:get, "https://example.com/rss").
               with(
                 headers: {
                 'Accept'=>'*/*',
                 'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
                 'User-Agent'=>'Ruby'
                 }).
               to_return(status: 200, body: body, headers: {})
      Item.create!(url: "https://example.com/article-1", title: "Test Article", source_id: source.id, type: "Article", content: body)
    end

    let(:crawler) { RssCrawler.new(source) }

    it "Ne créé pas de doublon en base" do
      expect { crawler.fetch }.to_not change(Item, :count)
    end
  end

  context "quand la réponse est 304 (not modified) et que rien n'est créé" do
    before do
      stub_request(:get, "https://example.com/rss").
               with(
                 headers: {
                 'Accept'=>'*/*',
                 'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
                 'User-Agent'=>'Ruby'
                 }).
               to_return(status: 304, body: body, headers: {})
    end

    let(:crawler) { RssCrawler.new(source) }

    it "Ne créé rien car rien de nouveau" do
      expect { crawler.fetch }.to_not change(Item, :count)
    end
  end

  context "quand la source a un etag et que le header If-None-Match est envoyé" do
    let(:source_with_etag) { Source.create!(etag: "33a64df551425fcc55e4d42a148795d9f25f89d4", last_modified: nil, url: "https://example.com/rss", source_type: "article", name: "test") }
    before do
      stub_request(:get, "https://example.com/rss").
               with(
                 headers: {
                 'Accept'=>'*/*',
                 'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
                 'User-Agent'=>'Ruby'
                 }).
               to_return(status: 200, body: body, headers: { 'ETag'=>'33a64df551425fcc55e4d42a148795d9f25f89d4' })
    end

    let(:crawler) { RssCrawler.new(source_with_etag) }

    it "Le header If-None-Match est envoyé" do
      crawler.fetch
      expect(WebMock).to have_requested(:get, "https://example.com/rss").with(headers: { 'If-None-Match'=>'33a64df551425fcc55e4d42a148795d9f25f89d4' })
    end
  end

  context "quand la source a last_modified et que le header If-Modified-Since est envoyé" do
    let(:source_with_last_modified) { Source.create!(etag: nil, last_modified: "Wed, 21 Oct 2015 07:28:00 GMT", url: "https://example.com/rss", source_type: "article", name: "test") }
    before do
      stub_request(:get, "https://example.com/rss").
               with(
                 headers: {
                 'Accept'=>'*/*',
                 'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
                 'User-Agent'=>'Ruby'
                 }).
               to_return(status: 200, body: body, headers: { 'If-Modified-Since'=>'Wed, 21 Oct 2015 07:28:00 GMT' })
    end

    let(:crawler) { RssCrawler.new(source_with_last_modified) }

    it "Le header If-Modified-Since est envoyé" do
      crawler.fetch
      expect(WebMock).to have_requested(:get, "https://example.com/rss").with(headers: { 'If-Modified-Since'=>'Wed, 21 Oct 2015 07:28:00 GMT' })
    end
  end

  context "quand la source a un etag et last_modified et que les headers sont envoyés" do
    let(:source_with_headers) { Source.create!(etag: "33a64df551425fcc55e4d42a148795d9f25f89d4", last_modified: "Wed, 21 Oct 2015 07:28:00 GMT", url: "https://example.com/rss", source_type: "article", name: "test") }
    before do
      stub_request(:get, "https://example.com/rss").
               with(
                 headers: {
                 'Accept'=>'*/*',
                 'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
                 'User-Agent'=>'Ruby'
                 }).
               to_return(status: 200, body: body, headers: { 'ETag'=>'33a64df551425fcc55e4d42a148795d9f25f89d4', 'If-Modified-Since'=>'Wed, 21 Oct 2015 07:28:00 GMT' })
    end

    let(:crawler) { RssCrawler.new(source_with_headers) }

    it "Les 2 headers sont envoyé" do
      crawler.fetch
      expect(WebMock).to have_requested(:get, "https://example.com/rss").with(headers: { 'If-None-Match'=>'33a64df551425fcc55e4d42a148795d9f25f89d4', 'If-Modified-Since'=>'Wed, 21 Oct 2015 07:28:00 GMT' })
    end
  end

  context "quand la source n'a aucun headers" do
    before do
      stub_request(:get, "https://example.com/rss").
               with(
                 headers: {
                 'Accept'=>'*/*',
                 'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
                 'User-Agent'=>'Ruby'
                 }).
               to_return(status: 200, body: body, headers: {})
    end

    let(:crawler) { RssCrawler.new(source) }

    it "Les 2 headers ne sont pas envoyés" do
      crawler.fetch
      expect(WebMock).to_not have_requested(:get, "https://example.com/rss").with(headers: { 'If-None-Match'=>'33a64df551425fcc55e4d42a148795d9f25f89d4', 'If-Modified-Since'=>'Wed, 21 Oct 2015 07:28:00 GMT' })
    end
  end
end
