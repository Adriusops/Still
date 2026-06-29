class SourceTypeDetector
  def initialize(url)
    @url = url
  end

  def detect
    if @url.include?("youtube.com")
     "video"
    elsif @url.include?("spotify.com")
     "podcast"
    else
     "article"
    end
  end

end
