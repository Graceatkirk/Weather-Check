import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const DB_PATH = path.join(__dirname, '../../../db/db.json');
const API_KEY = process.env.OPENWEATHER_API_KEY;

router.post('/', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Get city coordinates using fetch
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    const [location] = geoData;

    if (!location) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon } = location;

    // Get weather data using fetch
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Save city to search history
    const history = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const newEntry = { id: uuidv4(), city, lat, lon };
    history.push(newEntry);
    fs.writeFileSync(DB_PATH, JSON.stringify(history, null, 2));

    return res.json({ weather: weatherData, savedCity: newEntry });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
