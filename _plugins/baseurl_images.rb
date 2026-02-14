# Automatically prepend site.baseurl to image src attributes
# that start with "/" but don't already include the baseurl.
# This fixes images in markdown content on GitHub Pages.

Jekyll::Hooks.register :documents, :post_render do |doc|
  next if doc.output.nil?
  baseurl = doc.site.config["baseurl"].to_s
  next if baseurl.empty?

  # Fix <img src="/assets/..."> tags
  doc.output = doc.output.gsub(/(<img[^>]+src=")(\/(assets|images)[^"]*)(")/) do |match|
    prefix, path, _dir, suffix = $1, $2, $3, $4
    if path.start_with?(baseurl)
      match
    else
      "#{prefix}#{baseurl}#{path}#{suffix}"
    end
  end
end

Jekyll::Hooks.register :pages, :post_render do |page|
  next if page.output.nil?
  baseurl = page.site.config["baseurl"].to_s
  next if baseurl.empty?

  page.output = page.output.gsub(/(<img[^>]+src=")(\/(assets|images)[^"]*)(")/) do |match|
    prefix, path, _dir, suffix = $1, $2, $3, $4
    if path.start_with?(baseurl)
      match
    else
      "#{prefix}#{baseurl}#{path}#{suffix}"
    end
  end
end

Jekyll::Hooks.register :posts, :post_render do |post|
  next if post.output.nil?
  baseurl = post.site.config["baseurl"].to_s
  next if baseurl.empty?

  post.output = post.output.gsub(/(<img[^>]+src=")(\/(assets|images)[^"]*)(")/) do |match|
    prefix, path, _dir, suffix = $1, $2, $3, $4
    if path.start_with?(baseurl)
      match
    else
      "#{prefix}#{baseurl}#{path}#{suffix}"
    end
  end
end
