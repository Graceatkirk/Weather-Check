import dotenv from 'dotenv';
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

}

interface IWeatherService {
  getWeatherForCity(city: string): Weather[]; //this is an async function
}
// TODO: Complete the WeatherService class
class WeatherService {

  async getWeatherForCity(city: string): Promise<Weather[]> {
    // get the weather from the API

    // filter to the days you want (current + 5)

    // map the API data to your weather class
  }
}

export default new WeatherService();
