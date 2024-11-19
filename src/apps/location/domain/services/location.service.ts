import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from '../dto/create.location.dto';
import { Location } from '../../data-access/entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { City } from '../../data-access/entities/city.entity';
import { WeatherService } from '../../../weather/domain/services/weather.service';
import { LocationWithWeather } from '../types/location-data';
import { ERROR_MESSAGES } from '../../../../libs/constants/constants';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly weatherService: WeatherService,
  ) {}

  async getLocationsByUserId(userId: number): Promise<LocationWithWeather[]> {
    const locationData = await this.locationRepository
      .createQueryBuilder('location')
      .select(['location.id', 'city.name'])
      .innerJoin('location.city', 'city')
      .where('location.userId = :userId', { userId })
      .getRawMany();

    if (locationData.length === 0) {
      throw new BadRequestException({
        message: ERROR_MESSAGES.NO_LOCATIONS_ADDED,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Extract both location id and city name
    const locations = locationData.map((result) => ({
      locationId: result.location_id,
      cityName: result.city_name,
    }));

    //fetch weather data for each city
    const weatherData = await Promise.all(
      locations.map((location) =>
        this.weatherService.getWeatherData(location.cityName),
      ),
    );

    // Return the data with location IDs and associated current weather data
    return locations.map((location, index) => ({
      locationId: location.locationId,
      cityName: location.cityName,
      weather: weatherData[index],
    }));
  }

  async createLocation(
    id: number,
    createLocationDto: CreateLocationDto,
  ): Promise<Location[]> {
    const { cities } = createLocationDto;

    const validCities = await this.cityRepository.find({
      where: { name: In(cities) },
    });
    // Extract the names of valid cities
    const foundCityNames = validCities.map((city) => city.name);

    // Cross-check to find missing cities
    const missingCities = cities.filter(
      (city) => !foundCityNames.includes(city),
    );

    // Throw an error if any city is missing
    if (missingCities.length > 0) {
      throw new BadRequestException({
        message: `${ERROR_MESSAGES.NO_LOCATIONS_ADDED} ${missingCities.join(', ')}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    // Fetch existing locations for this user
    const existingLocations = await this.locationRepository.find({
      where: {
        user: { id },
        city: { id: In(validCities.map((city) => city.id)) },
      },
      relations: ['city'],
    });

    // Extract the names of cities that are already added
    const existingCityNames = existingLocations.map(
      (location) => location.city.name,
    );

    // Cross-check to find duplicate cities
    const duplicateCities = cities.filter((city) =>
      existingCityNames.includes(city),
    );

    if (duplicateCities.length > 0) {
      throw new BadRequestException({
        message: `${ERROR_MESSAGES.CITIES_ALREADY_ADDED} ${duplicateCities.join(', ')}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Create location entries for all valid cities not already added
    const newLocations = validCities
      .filter((city) => !existingCityNames.includes(city.name)) // Filter out duplicates
      .map((city) => ({
        user: { id },
        city: { id: city.id },
      }));

    // Save all locations
    return this.locationRepository.save(newLocations);
  }

  async deleteLocation(locationId: number): Promise<void> {
    const result = await this.locationRepository.delete(locationId);
    if (result.affected === 0) {
      throw new NotFoundException({
        message: ERROR_MESSAGES.LOCATION_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async getUsersLocations(): Promise<string[]> {
    const cityNames = await this.locationRepository
      .createQueryBuilder('location')
      .select('city.name')
      .innerJoin('location.city', 'city')
      .getRawMany();
    const cities: string[] = cityNames.map((result) => result.city_name);
    return cities;
  }
}
