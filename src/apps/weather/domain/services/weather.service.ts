import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { WeatherData, WeatherQueryResponse } from '../types/weather-data';
import { WeatherApiClient } from '../clients/weather-api';
import { DEFAULT_FORECAST_DAYS } from '../../../../libs/constants/constants';

@Injectable()
export class WeatherService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly weatherApiClient: WeatherApiClient,
  ) {}

  async getWeatherData(city: string): Promise<WeatherQueryResponse> {
    const cachedWeather = await this.cacheManager.get<WeatherData>(city);

    if (cachedWeather) {
      const { location, current } = cachedWeather;
      return { location, current };
    }

    const result = await this.weatherApiClient.fetchCurrentWeather(city);
    await this.cacheManager.set(city, result);
    return result;
  }

  async getForecastData(city: string): Promise<WeatherData> {
    const cachedWeather = await this.cacheManager.get<WeatherData>(city);
    if (cachedWeather && cachedWeather.forecast) {
      return cachedWeather;
    }

    const data = await this.weatherApiClient.fetchForecastWeather(
      city,
      DEFAULT_FORECAST_DAYS,
    );

    await this.cacheManager.set(city, data);
    return data;
  }
}
