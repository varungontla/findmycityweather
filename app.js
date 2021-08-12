require('dotenv').config()
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const TelegramBot = require('node-telegram-bot-api');


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const token = '1867349408:AAEcYG8z7jozlU6YjD1dfpgym0R9FvmYD3U';
const bot = new TelegramBot(token, {polling: true});

app.get("/", function(req, res){

  res.sendFile(__dirname+"/index.html")

});



app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = "621f8aa7743da4b639a13d3dfc489a19"; // add your api key from weather api or any other.
  const unit  = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
  https.get(url, function(response) {
    console.log(response.statusCode);

    if(response.statusCode === 200){
      response.on("data", function(data){
        const weatherdata = JSON.parse(data);
        const temp = weatherdata.main.temp
        const desc = weatherdata.weather[0].description
        const icon = weatherdata.weather[0].icon
        const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
      //.write method helps to send as many as data to the requested one.
        res.render("result", {Data: weatherdata,ImageUrl: imageURL});
      });
    }else{
      res.render("error");
    }

  });
});

app.post("/error", function(req, res) {
  res.redirect("/");
});


////////////////////////////////////Telegram Bot//////////////////////////////////////



bot.onText(/\ (.+)/, (msg, match) => {

  const chatId = msg.chat.id;

  const query = match[1];
  const apiKey = "621f8aa7743da4b639a13d3dfc489a19"; // add your api key from weather api or any other.
  const unit  = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
  https.get(url, function(response) {
    console.log(response.statusCode);

    if(response.statusCode === 200){
      response.on("data", function(data){
        const weatherdata = JSON.parse(data);
        const temp = weatherdata.main.temp
        const desc = weatherdata.weather[0].description
      //.write method helps to send as many as data to the requested one.
        bot.sendMessage(chatId,query+"\n"+"temperature =>"+temp+" C"+"\n"+"Weather Condition =>"+desc+"\n");
      });
    }else{
      bot.sendMessage(chatId,"Not a Valid City name please try again");
    }

  });

});







app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});
