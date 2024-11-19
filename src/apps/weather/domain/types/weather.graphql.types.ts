import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Location {
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
export class Condition {
  @Field()
  text: string;
}

@ObjectType()
export class CurrentWeather {
  @Field()
  last_updated: string;

  @Field(() => Float)
  temp_c: number;

  @Field(() => Condition)
  condition: Condition;

  @Field(() => Float)
  wind_kph: number;

  @Field()
  wind_dir: string;

  @Field(() => Int)
  humidity: number;
}

@ObjectType()
export class Day {
  @Field(() => Float)
  maxtemp_c: number;

  @Field(() => Float)
  mintemp_c: number;

  @Field(() => Float)
  avgtemp_c: number;

  @Field(() => Float)
  maxwind_kph: number;

  @Field(() => Int)
  avghumidity: number;

  @Field(() => Int)
  daily_will_it_rain: number;

  @Field(() => Int)
  daily_chance_of_rain: number;

  @Field(() => Int)
  daily_will_it_snow: number;

  @Field(() => Int)
  daily_chance_of_snow: number;

  @Field(() => Condition)
  condition: Condition;
}

@ObjectType()
export class Astro {
  @Field()
  sunrise: string;

  @Field()
  sunset: string;

  @Field()
  moonrise: string;

  @Field()
  moonset: string;
}

@ObjectType()
export class ForecastDay {
  @Field()
  date: string;

  @Field(() => Day)
  day: Day;

  @Field(() => Astro)
  astro: Astro;
}

@ObjectType()
export class Forecast {
  @Field(() => [ForecastDay])
  forecastday: ForecastDay[];
}

@ObjectType()
export class WeatherQueryResponse {
  @Field(() => Location)
  location: Location;

  @Field(() => CurrentWeather)
  current: CurrentWeather;

  @Field(() => Forecast)
  forecast: Forecast;
}
