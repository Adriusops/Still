require 'rails_helper'

RSpec.describe FeedComposer do
  let(:items) { [ Item.new(source_id: 1), Item.new(source_id: 2), Item.new(source_id: 1) ] }

  it "compose les items par source_id sans doublons" do
    composer  = FeedComposer.compose(items).each_cons(2).all? { |a, b| a.source_id != b.source_id }
    expect(composer).to be_truthy
  end
end
