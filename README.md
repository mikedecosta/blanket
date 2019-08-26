# blanket

## Usage
Make a POST request to `https://blanket-251017.appspot.com/locations`
* The content type should be `application/json`
* The data provided should be a json object with this structure: `{"locations": ["location 1", "location 2"]}`
* The API will return an object with an `accepted` array of points and the closest other point with the distance between them in miles, and a `rejected` array of locations that we couldn't geocode for what ever reason.

Here is an example:
```
curl https://blanket-251017.appspot.com/locations -d '{"locations": ["Statue of Liberty", "Hershey State Park", "Empire State Building", "8 Island Hill Ave. Malden, MA, 02148", "Port Authority Bus Terminal", "69 Hill st, Malden, MA, 02149", "167 Chatham Road, Harwich, MA, 02645", "141 Tremont St, Boston, MA, 02114"]}' -H "Content-Type: application/json" | jq
{
  "accepted": [
    {
      "target": "Statue of Liberty National Monument, New York, NY 10004, USA",
      "closestPoint": "20 W 34th St, New York, NY 10001, USA",
      "distance": "5 miles"
    },
    {
      "target": "100 Hersheypark Dr, Hershey, PA 17033, USA",
      "closestPoint": "Statue of Liberty National Monument, New York, NY 10004, USA",
      "distance": "140 miles"
    },
    {
      "target": "20 W 34th St, New York, NY 10001, USA",
      "closestPoint": "Port Authority Bus Station, 625 8th Ave, New York, NY 10109, USA",
      "distance": "1 miles"
    },
    {
      "target": "8 Island Hill Ave, Malden, MA 02148, USA",
      "closestPoint": "69 Hill St, Malden, MA 02148, USA",
      "distance": "1 miles"
    },
    {
      "target": "Port Authority Bus Station, 625 8th Ave, New York, NY 10109, USA",
      "closestPoint": "20 W 34th St, New York, NY 10001, USA",
      "distance": "1 miles"
    },
    {
      "target": "69 Hill St, Malden, MA 02148, USA",
      "closestPoint": "8 Island Hill Ave, Malden, MA 02148, USA",
      "distance": "1 miles"
    },
    {
      "target": "167 Chatham Rd, Harwich, MA 02645, USA",
      "closestPoint": "141 Tremont St, Boston, MA 02111, USA",
      "distance": "70 miles"
    },
    {
      "target": "141 Tremont St, Boston, MA 02111, USA",
      "closestPoint": "69 Hill St, Malden, MA 02148, USA",
      "distance": "6 miles"
    }
  ],
  "rejected": []
}
```

Things to add to make this better:
* UI form to call this and view results from the web
* Async response that returns an ID to the result set that you can view later
* Deduping of input and output (if 2 locations have each other as closest points, just show it 1 time)
* Not looking through every single combination, store them in a lat/long order and do early cut off
* Clean up of application files and split into multiple app files for encapsulation of concerns (routes, geocoding-utils, ui, etc)
* Limits for our API key
* cache or datastore backend to store commonly used addresses to not have to geocode them everytime
* Allow changing unit from "miles" to "km"
