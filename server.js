var express = require('express')
var bodyParser = require('body-parser')
var service = express()
var csv = require('csv')
var obj = csv()

service.use(bodyParser.json())

var server = service.listen(8081, function() {
  console.log('API server listening...')
})

function MyCSV(STREET_ADDRESS,LISTING_REGION,LISTING_COMMUNITY,LISTING_CITY,POSTAL_CODE,LATITUDE,LONGITUDE,MANAGED_BY,MAIN_PHOTO,PROPERTY_TYPE,PRICE,BEDS,BATHS,SQ_FT,PETS) {
    this.street_address = STREET_ADDRESS
    this.price = PRICE
}

var MyData = []

obj.from.path('apt_data.csv').to.array(function (data) {
    for (var index = 0; index < data.length; index++) {
        MyData.push(new MyCSV(data[index][0], data[index][1], data[index][2],
         data[index][3], data[index][4], data[index][5], data[index][6], data[index][7],
          data[index][8], data[index][9], data[index][10], data[index][11], data[index][12],
           data[index][13], data[index][14], data[index[15]]))
    }
    console.log(MyData); //display the data in the console
})

function get_count_under(price) {
  count = 0
  var apt_price
  for(var index = 0; index < MyData.length; index++) {
    apt_price = MyData[index]["price"]
    if(apt_price < price) {
      count++
    }
  }
  return count
}

function process_request(req,res) {
  output_string = "There was an error"
  if(req.body.queryResult.intent.name == "projects/apartmentfinder-83eb2/agent/intents/22e5e33a-bd93-4e47-a419-a07ac04c548d") {
    output_string = "There are " + get_count_under(req.body.queryResult.parameters["unit-currency"].amount) + " apartments under " + req.body.queryResult.parameters["unit-currency"].amount + "."
  } else {
    output_string = "asdkfj"
  }
  return res.json({
    "fulfillmentMessages": [],
    "fulfillmentText": output_string,
    "payload": {},
    "outputContexts": [],
    "source": "Test source",
    "followupEventInput": {}
  })
}

service.post('/hook', function(req, res) {
  console.log(JSON.stringify(req.body,null,2))
  process_request(req,res)
  //return res.json({ //read about these fields
    //"fulfillmentMessages": [], //displayed
    //"fulfillmentText": "This is an example response from the webhook", //converted to speech
    //"payload": {},
    //"outputContexts": [],
    //"source": "Test Source",
    //"followupEventInput": {}
  //})
})
