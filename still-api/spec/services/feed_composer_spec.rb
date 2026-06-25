require 'rails_helper'

RSpec.describe FeedComposer do
  let(:items) { [ Item.new(source_id: 1), Item.new(source_id: 2), Item.new(source_id: 1) ] }

  it "compose les items par source_id sans doublons consécutifs" do
    result = FeedComposer.compose(items)

    result.each_cons(2) do |a, b|
        expect(a.source_id).not_to eq(b.source_id)
      end
  end
end
