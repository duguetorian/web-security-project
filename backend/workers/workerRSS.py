# usage: WorkerRSS.py [-h] -l LINK [-d DATE] [-e ETag]

import feedparser
from http import HTTPStatus
import argparse
from urllib.parse import urlparse
from re import match

from Feed import Feed

BAD_RSS_FORMAT = -1
PATTERN_DATE = r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z'

def getFeed(link:str, modified:str, etag:str) -> feedparser:
    return feedparser.parse(link, modified=modified, etag=etag)

def process(raw_data:feedparser) -> Feed:
    feed = Feed(raw_data.status)
    if raw_data.status < 400:
        if raw_data.status == HTTPStatus.NOT_MODIFIED: # 304
            pass
        if raw_data.status == HTTPStatus.MOVED_PERMANENTLY: # 301 New permanent address
            feed.add_link(raw_data.href)
            feed.scrap_data(raw_data)
        if raw_data.status == HTTPStatus.FOUND: # 302 New temporary address
            feed.scrap_data(raw_data)
        if raw_data.status == HTTPStatus.OK :# 200
            feed.scrap_data(raw_data)
    return feed

def check_url(url:str) -> str:
    # Parse the URL to ensure it's a valid URL
    parsed_url = urlparse(url)
    if not all([parsed_url.scheme, parsed_url.netloc]):
        raise argparse.ArgumentTypeError("Invalid URL: {}".format(url))
    return url

def check_date(date:str) -> str:
    # Parse date to ensure it's a valid format
    if not match(PATTERN_DATE, date):
        raise argparse.ArgumentTypeError("Invalid date: {}".format(date))
    return date

def check_etag(etag:str) -> str:
    if not etag[0] == '"':
        etag = '"' + etag
    if not etag[-1] == '"':
        etag = etag + '"'
    return etag

def parse_arg() -> argparse.Namespace:
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("-l", "--link",          dest="link",          type=check_url, 
                        metavar="LINK", required=True, help="Link to search.")
    parser.add_argument("-d", "--last_modified", dest="last_modified", type=check_date, 
                        metavar="DATE" ,help="Date of last known modification of the feed.")
    parser.add_argument("-e", "--etag",          dest="etag",          type=check_etag, 
                        metavar="ETag", help="Entity Tag to identify the client.")

    args = parser.parse_args()
    return args

def main():
    args = parse_arg()
    data = getFeed(args.link, modified=args.last_modified, etag=args.etag)
    json = process(data)
    print(json.serialize())

if __name__ == "__main__":
    main()

