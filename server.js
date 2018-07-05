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
    this.beds = BEDS
    this.baths = BATHS
    this.sqft = SQ_FT
    this.pets = PETS
    this.main_photo = MAIN_PHOTO
}

var MyData = []
var apts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]

obj.from.path('apt_data.csv').to.array(function (data) {
    for (var index = 0; index < data.length; index++) {
        MyData.push(new MyCSV(data[index][0], data[index][1], data[index][2],
         data[index][3], data[index][4], data[index][5], data[index][6], data[index][7],
          data[index][8], data[index][9], data[index][10], data[index][11], data[index][12],
           data[index][13], data[index][14], data[index[15]]))
    }
    console.log(MyData); //display the data in the console
})

function get_count(req, res) {
  console.log("counting")
  var price, price_funct, beds, baths, bedsbathssqft_funct, pets, pets_funct
  if(req.queryResult.parameters["unit-currency"].amount) {
    price = parseInt(req.queryResult.parameters["unit-currency"].amount)
    console.log("price: " + price)
  }
  if(req.queryResult.parameters["num_beds"]) {
    beds = req.queryResult.parameters["num_beds"]["number-integer"]
    console.log("beds: " + beds)
  }
  if(req.queryResult.parameters["num_baths"]) {
    baths = req.queryResult.parameters["num_baths"]["sys.number-integer"]
  }
  if(req.queryResult.parameters["num_baths"]) {
    sqft = req.queryResult.parameters["area"]["sys.number-integer"]
  }
  if(req.queryResult.parameters["pets"]) {
    pets = req.queryResult.parameters["pets"]
  }
  return filter(price, price_funct, beds, baths, bedsbathssqft_funct, pets, pets_funct)
}

function filter(price, price_funct, beds, baths, bedsbathssqft_funct, sqft, pets, pets_funct) {
  console.log("filtering")
  if(price) {
    console.log("filtering by price")
    apts = apts.filter(a => price_funct(MyData[a].price.toString().replace("+","").trim(), price))
  }
  if(beds) {
    console.log("filtering by beds")
    apts = apts.filter(a => bedsbathssqft_funct(MyData[a].beds, beds))
  }
  if(baths) {
    console.log("filtering by baths")
    apts = apts.filter(a => bedsbathssqft_funct(MyData[a].baths, baths))
  }
  if(sqft) {
    console.log("filtering by square footage")
    apts = apts.filter(a => bedsbathssqft_funct(MyData[a].sqft, sqft))
  }
  if(pets) {
    console.log("filtering by allowed pets")
    apts = apts.filter(a => pets_funct(MyData[a].pets, pets))
  }
  for(var i = 0; i < apts.length; i++) {
    console.log(MyData[apts[i]].street_address)
  }
  return apts.length

  function price_funct(apt_price, price) {
    console.log(apt_price + " >= " + price + "; " + (apt_price >= price))
    return apt_price <= price
  }

  function bedsbathssqft_funct(apt_b, b) {
    var range_data = false
    if(apt_b.includes("-")) {
      range_data = true
      var first_num = apt_b.charAt(0); var second_num = apt_b.charAt(apt_b.length - 1)
      var data_range = []
      for(var i = 0; i <= (second_num - first_num); i++) {
        data_range[i] = first_num++
      }
      for(var i = 0; i < data_range.length; i++) {
        if(data_range[i] >= b) {
          console.log(data_range[i] + " >= " + b + "; " + (data_range[i] >= b))
          return true
        }
      }
    } else {
      console.log(apt_b + " >= " + b + "; " + (apt_b >= b))
      return apt_b >= b
    }
  }

  function pets_funct(apt_pets, pets) {
    if(pets = "pets") {
      return apt_pets = "OK"
    } else { //if the user asks about a specific animal
      return (apt_pets == pets) || (apt_pets == "OK")
    }
  }
}

function reset(apts) {
  apts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
}

function process_request(req,res) {
  reset(apts)
  output_string = "There was an error"
  switch(req.body.queryResult.intent.displayName) {
    case "how_many_apts":
      output_string = "There are " + get_count(req.body) + " apartments which meet your criteria."
      break;
    case "ask_abt_listing":
      console.log("in ask_abt_listing")
      if(req.body.queryResult.parameters["ordinal"] && req.body.queryResult.parameters["questions"]) {
        console.log("asking a specific question about a specific listing")
        apt_index = [req.body.queryResult.parameters["ordinal"]]; apt = MyData[apts[apt_index]]
        switch (req.body.queryResult.parameters["questions"]) {
          case "cost":
            output_string = "Listing #" + apt_index + " costs " + apt.price + "."
            break;
          case "how many bedrooms":
            output_string = "Listing #" + apt_index + " has " + apt.beds + " bedrooms."
            break;
          case "how many bathrooms":
            output_string = "Listing #" + apt_index + " has " + apt.baths + " bathrooms."
            break;
          case "photo":
            output_string = "You can see a photo of this listing at this link: " + apt.main_photo + "."
            break;
          default:
            output_string = "I'm afraid I don't understand your question."
        }
      } else if(req.body.queryResult.parameters["ordinal"]) {
        console.log("asking for general info about a specific listing")
        apt_index = req.body.queryResult.parameters["ordinal"]; apt = MyData[apts[apt_index]]
        output_string = "This listing costs $" + apt.price + " per month. It has " + apt.beds + " bedrooms and " + apt.baths + " bathrooms."
      } else { //random listing
        console.log("asking for general info about a random listing")
        var apt_index = Math.floor(Math.random()*apts.length); apt = MyData[apts[apt_index]]
        "Listing #" + apt_index + "costs $" + apt.price + " per month. It has " + apt.beds + " bedrooms and " + apt.baths + " bathrooms."
      }
      break;
    case "save_send":
      switch(req.body.queryResult.parameters["save_send"]) {
        case "save":
          output_string = "Listing saved!"
          break;
        case "send":
          output_string = "Listing sent!"
          break;
        default:
          output_string = "I'm afraid I don't understand."
      }
      break;
    case "reset":
      output_string = "Your parameters have been reset."
      reset(apts)
      break;
    default:
      output_string = "Could not match intent. Try again."
  }
  return res.json({
    "fulfillmentMessages": [],
    "fulfillmentText": output_string,
    "payload": {"slack":{"text":output_string}},
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
