import fs from 'fs';
import path from 'path';

// Define the City class with id and name properties
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const DB_PATH = path.join(__dirname, '../../db.json');

class HistoryService {

  // Read the search history file
  private async read() {
    try {
      const data = await fs.promises.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return []; // Return an empty array if there's an error (e.g., file not found)
    }
  }

  // Write the updated cities to the search history file
  private async write(cities: City[]) {
    try {
      await fs.promises.writeFile(DB_PATH, JSON.stringify(cities, null, 2));
    } catch (error) {
      throw new Error('Error writing to history file');
    }
  }

  // Get all cities from the search history
  async getCities() {
    const cities = await this.read();
    return cities.map((city: any) => new City(city.id, city.name)); // Return cities as instances of City
  }

  // Add a city to the search history
  async addCity(city: string) {
    const cities = await this.read();
    const newCity = new City(this.generateId(), city);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // Remove a city from the search history by id
  async removeCity(id: string) {
    let cities = await this.read();
    cities = cities.filter((city: City) => city.id !== id);
    await this.write(cities);
    return cities;
  }

  // Helper function to generate a unique ID for a city
  private generateId() {
    return Math.floor(Math.random() * 1000000).toString();
  }
}

export default new HistoryService();
