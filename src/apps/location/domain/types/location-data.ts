import { WeatherData } from '../../../weather/domain/types/weather-data';

export interface LocationWithWeather {
  locationId: number;
  cityName: string;
  weather: Omit<WeatherData, 'forecast'>;
}
