import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import ejs from "ejs";
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const port = 3000;
const MyApiKey = "acfd756df1ead1e0490f63e1da3beb5e";
app.set('views', path.join(__dirname, 'views'));
app.get("/", (req, res) => {  
  res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
  try {
    var cityName = req.body.city ;
    const response1 = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${MyApiKey}`
    );  
    const latitude = response1.data[0].lat;
    const longitude = response1.data[0].lon;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${MyApiKey}`);
    const result = response.data;  
    console.log(JSON.stringify(result));
    res.render("index.ejs",{result});

  }catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized: Invalid API key');
      // Handle 401 error
    } else {
      res.render("index.ejs",{err:error.message})
      console.error('Request failed:', error.message);
      // Handle other errors
    }}
});

app.listen(port, () => {
  console.log("Server running at port " + port);
});
