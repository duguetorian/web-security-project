import json
from datetime import datetime

class Feed:
    data = {
        "status": 0,
        "error": 0,
        "source": {},
        "articles": []
    }
    def __init__(self, status:int, id:int=None):
        self.id = id
        self.data["status"] = status
        
    def serialize(self) -> str:
        return json.dumps(self.data)
    
    def set_source(self, link:str, title:str, etag:str, description:str, version:str, updatedAt:str=None):
        self.data["source"] = {
            "title": title,
            "description": description,
        }
        if version:
            self.data["source"]["version"] = version
        if etag:
            self.data["source"]["etag"] = etag
        if updatedAt:
            self.data["source"]["updatedAt"] = updatedAt
    
    def add_article(self, id:int, link:str, title:str, description:str, publishedAt:str, updatedAt:str):
        self.data["articles"].append({
            "feedId": id,
            "link": link,
            "title": title,
            "description": description,
        })
        if updatedAt:
            self.data["articles"][-1]["updatedAt"] = updatedAt
        if publishedAt:
            self.data["articles"][-1]["publishedAt"] = publishedAt

    def add_link(self, link:str):
        self.data['source']['link'] = link

    @staticmethod
    def format_datetime(parsed_date:str) -> str:
        dt_obj = datetime(*parsed_date[:6])
        return dt_obj.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
    
    def scrap_data(self, raw_data) -> int:
         # Invalid RSS
        if raw_data.bozo:
            self.data["error"] = 1
            return 1
        # Source title
        self.data["source"]["title"] = raw_data.feed['title']

        # Source description
        if "summary" in raw_data.feed:
            self.data["source"]["description"] = raw_data.feed['summary']
        elif "subtitle" in raw_data.feed:
            self.data["source"]["description"] = raw_data.feed['subtitle']

        # Source etag
        if "etag" in raw_data:
            self.data["source"]["etag"] = raw_data.etag

        # Source version
        if "version" in raw_data:
            self.data["source"]["version"] = raw_data.version

        # Source updated date
        if "updated_parsed" in raw_data:
            self.data["source"]["updatedAt"] = Feed.format_datetime(raw_data["updated_parsed"])

        if "entries" in raw_data:
            entries = raw_data["entries"]
            n = len(entries)
            for i in range(n):

                # Entry id
                entry_id = entries[i].id

                # Entry link
                entry_link = ""
                if "link" in entries[i]:
                    entry_link = entries[i].link
                elif "links" in entries[i]:
                    if type(entries[i]["links"]) == list and len(entries[i]["links"]) > 0:
                        if "href" in entries[i]["links"][0]:
                            entry_link = entries[i]["links"][0]["href"]

                # Entry title
                entry_title = entries[i].title

                # Entry description
                if "summary" in entries[i]:
                    entry_description = entries[i]["summary"]
                elif "description" in entries[i]:
                    entry_description = entries[i]["description"]
                else:
                    entry_description = ""

                # Entry published date and format the datetime object as a string
                entry_published = ""
                if "published_parsed" in entries[i]:
                    entry_published = Feed.format_datetime(entries[i].published_parsed)
                
                entry_updated = ""
                if "updated_parsed" in entries[i]:
                    entry_updated = Feed.format_datetime(entries[i].updated_parsed)

                self.add_article(id=entry_id, link=entry_link, title=entry_title, description=entry_description, 
                                publishedAt=entry_published, updatedAt=entry_updated)
        return 0
