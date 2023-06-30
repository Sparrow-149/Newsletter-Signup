// including the express, body-parser and request modules
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// creating a new express application
const app = express();

// telling the app to use the body-parser middleware and to parse the body as URL encoded data
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// GET request to the root route
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// POST request to the root route
app.post("/", function(req, res) {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    // console.log(firstName, lastName, email);  

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const JSONData  = JSON.stringify(data);
    const url = "https://us9.api.mailchimp.com/3.0/lists/2d080f8559";
    const options = {
        method: "POST",
        auth: "aman:1f22356471e8206a30d720f0f19905ac-us9"
    };
    const request = https.request(url, options, function(response) {
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
            // res.send("success");
        }
        else   
        {
            // res.send("failed");
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    }); 
    request.write(JSONData);
    request.end();
});

// starting the server on port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});


// API Key
// 1f22356471e8206a30d720f0f19905ac-us9


// List ID
// 2d080f8559