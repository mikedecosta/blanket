# blanket

## Usage
Make a POST request to `https://blanket-251017.appspot.com/locations`
* The content type should be `application/json`
* The data provided should be a json object with this structure: `{"locations": ["location 1", "location 2"]}`
* The locations array needs to have at least 2 elements
* The API will return an ID to a result set

Make a GET request to `https://blanket-251017.appspot.com/locationResultSet/$LocationResultSet.ID`
* The API will return an object with the following structure `{id: string, accepted: [Object object, Object object...], rejected: int, locations: string}`
* The `id` will be the `locationResultSetId` that was passed in.
* The object structure within the `accepted` array will have the `target` location in question, the `closestPoint` to that target, and the `distance` in miles
* The `rejected` int represents the number of locations that could not be geocoded for what ever reason
* The `locations` will be a JSON encoded string of the original array of locations provided to produce the given result set.

## Example
```
curl https://blanket-251017.appspot.com/locations -d '{"locations": ["Statue of Liberty", "Hershey State Park", "Empire State Building", "8 Island Hill Ave. Malden, MA, 02148", "Port Authority Bus Terminal", "69 Hill st, Malden, MA, 02149", "167 Chatham Road, Harwich, MA, 02645", "141 Tremont St, Boston, MA, 02114"]}' -H "Content-Type: application/json"
{"locationResultSet.id":"eOx4DMsm4tnt8OcMXPGT"}

curl https://blanket-251017.appspot.com/locationResultSet/eOx4DMsm4tnt8OcMXPGT | jq
{
  "id": "eOx4DMsm4tnt8OcMXPGT",
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
  "locations": "[\"Statue of Liberty\", \"Hershey State Park\", \"Empire State Building\", \"8 Island Hill Ave. Malden, MA, 02148\", \"Port Authority Bus Terminal\", \"69 Hill st, Malden, MA, 02149\", \"167 Chatham Road, Harwich, MA, 02645\", \"141 Tremont St, Boston, MA, 02114\"]",
  "rejected": 0
}
```

## Running Locally

* Clone this repo: `git clone git@github.com:mikedecosta/blanket.git`
* Inside that repo, add a js file `app-config.js` with this line: `exports.GOOGLE_API_KEY = '<YOUR GOOGLE API KEY>';`
* run npm install with desired port exported `export PORT=8080 && npm install`
* Start npm `npm start`
* Then start making calls against the API, or visit `localhost:8080` to be redirected here. `curl http://localhost:8080/locations -H "Content-Type: application/json" -d '{"locations": ["Statue of Liberty", "Times Square"]}' | jq`

## Improvements
* UI form to call this and view results from the web
* DONE: ~~Async response that returns an ID to the result set that you can view later~~
* Deduping of input and output (if 2 locations have each other as closest points, just show it 1 time)
* ~~Not looking through every single combination, store them in a lat/long order and do early cut off~~ This is an unnecessary optimization for calls of 100's of addresses at a time. The bottleneck is the geocoding, not finding closest points. With larger datasets, this could be looked at again.
* The app really should be in multiple repos at this point. Work to geocode/find closest locations should be spun off in a queue processor and the Firebase acceess code shouldn't be handled by the same repo and machine as the API logic
* Require auth to give API access and restrict usage of the API to protect against abuse
* Ability to set other geocoding strategy besides Google
* cache or datastore backend to store commonly used addresses to not have to geocode them everytime
* Allow changing unit from "miles" to "km"
