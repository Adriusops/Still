require 'net/http'

RSpec.describe "test" do
  it "test" do
    Net::HTTP.get(hostname, "adrius.blog")
  end
end
