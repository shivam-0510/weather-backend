const express = require("express");
const app = express();
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/getWeather", async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const weatherResults = await Promise.all(
      cities.map(async (city) => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.API_KEY}`
          );
          const temperature = response.data.main.temp;
          return { [city]: `${temperature}°C` };
        } catch (error) {
          console.error(`Error fetching weather for ${city}: ${error.message}`);
          return { [city]: "N/A" };
        }
      })
    );

    const weather = Object.assign({}, ...weatherResults);
    //console.log(weather);
    return res.status(200).json({ weather: weather });
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
