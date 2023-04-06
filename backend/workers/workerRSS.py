import json

# Read the JSON file
data = {
    "code": 200, 
    "data": {
        "url": "/etc", 
        "etag": "30", 
        "title": "New l",
        "description": "description",
        "updatedAt" : "2001-04-05"
    }
}
# Send the JSON data to stdout
if __name__ == "__main__":
    print(json.dumps(data))
    # print("aaaa")