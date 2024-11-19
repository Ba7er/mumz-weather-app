import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// import { WeatherService } from '../weather/domain/weather.service';
import { LocationService } from '../../../location/domain/services/location.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { WeatherApiClient } from '../../domain/clients/weather-api';

@Injectable()
export class WeatherUpdateTask {
  constructor(
    private readonly locationService: LocationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly weatherApiClient: WeatherApiClient,
  ) {}

  @Cron('*/15 * * * *')
  async handleWeatherUpdate() {
    const locations = await this.locationService.getUsersLocations();

    for (const city of locations) {
      const data = await this.weatherApiClient.fetchCurrentWeather(city);
      await this.cacheManager.set(city, data);
    }
  }
}
