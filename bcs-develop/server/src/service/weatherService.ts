import dotenv from 'dotenv';
import { Dayjs } from 'dayjs';
dotenv.config();

// TODO: Define an interface for the Coordinates object (if you use the GEO API you are not required to)

interface IWeather {
  city: string;
  date: Dayjs | string; // you can use dayjs or just a string delete it if you do not
  tempF: number;
  windSpeed: number; //response.wind.speed,
  humidity: number;
  icon: string;
  iconDescription: string;
  }
// TODO: Define a class for the Weather object
class Weather implements IWeather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;

  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

class WeatherService {

  async getWeatherForCity(city: string): Promise<Weather[]> {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    
    // Fetch city coordinates (lat, lon)
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    const [location] = geoData;

    if (!location) {
      throw new Error('City not found');
    }

    const { lat, lon } = location;

    // Fetch weather data using coordinates
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Map the data to Weather instances
    const weatherList = weatherData.list.slice(0, 6); // Get the first 6 records (current + 5 days)
    return weatherList.map((data: any) => {
      return new Weather(
        city,
        data.dt_txt, // Date of the forecast
        data.main.temp, // Temperature (you can convert to Fahrenheit)
        data.wind.speed, // Wind speed
        data.main.humidity, // Humidity
        data.weather[0].icon, // Weather icon
        data.weather[0].description // Icon description
      );
    });
  }
}

export default new WeatherService();
