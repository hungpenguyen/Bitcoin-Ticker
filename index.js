const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) =>{
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {

  var crypto = req.body.crypto;
  var fiat = req.body.fiat;
  var amount = req.body.amount;

//these are the keywords from the request module. must follow it word for word.
  var options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      //these are keywords from the bitcoin api
      from: crypto,
      to: fiat,
      amount: amount
    }
  };

  request(options, (error, response, body) => {
    var data = JSON.parse(body); //this will get the data from JSON file into JS object to use
    var price = data.price;

    var currentDate = data.time;

    //by using res.write first before res.send, you can get multiple responses from the API, otherwise, res.send will end the process.
    res.write("<p>The current date is " + currentDate + "</p>");

    res.write("<h1>" + amount + " " + crypto + " is currently worth " + price + " " + fiat + "</h1>")

    res.send();

  })

})

app.listen(3000, () => { console.log("Server is running on port 3000..")})
