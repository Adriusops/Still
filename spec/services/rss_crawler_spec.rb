require 'rails_helper'

RSpec.describe RssCrawler do
  # 1. Préparer une Source en base avec les attributs minimaux
  let(:source) { Source.create!(etag: nil, last_modified: nil, url: "https://example.com/rss", source_type: "article", name: "test") }

  context "quand la réponse est 200 et qu'il n'y a pas d'etag" do
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
end
