import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

export interface WeatherData {
  location: LocationData;
  current: CurrentWeatherData;
  forecast: ForecastData;
}

export interface LocationData {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface CurrentWeatherData {
  last_updated: string;
  temp_c: number;
  condition: { text: string };
  wind_kph: number;
  wind_dir: string;
  humidity: number;
}

export interface ForecastData {
  forecastday: Array<ForecastDayData>;
}

export interface ForecastDayData {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: { text: string };
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
  };
}

// GraphQL Object Types
@ObjectType()
export class Location implements LocationData {
  @Field()
  name: string;

  @Field()
  region: string;

  @Field()
  country: string;

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lon: number;

  @Field()
  tz_id: string;

  @Field(() => Int)
  localtime_epoch: number;

  @Field()
  localtime: string;
}

@ObjectType()
export class CurrentWeather implements CurrentWeatherData {
  @Field()
  last_updated: string;

  @Field(() => Float)
  temp_c: number;

  @Field(() => Condition)
  condition: { text: string };

  @Field(() => Float)
  wind_kph: number;

  @Field()
  wind_dir: string;

  @Field(() => Int)
  humidity: number;
}

@ObjectType()
export class WeatherQueryResponse {
  @Field(() => Location)
  location: Location;

  @Field(() => CurrentWeather)
  current: CurrentWeather;
}

@ObjectType()
export class Condition {
  @Field()
  text: string;
}
