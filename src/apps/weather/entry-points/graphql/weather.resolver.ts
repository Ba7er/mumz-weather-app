import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherQueryResponse } from '../../domain/types/weather.graphql.types'; // Path to your types
import { WeatherService } from '../../domain/services/weather.service'; // Your service
import { GqlThrottlerGuard } from '../../../../libs/guards/gql-throttler.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => WeatherQueryResponse)
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(GqlThrottlerGuard)
  @Query(() => WeatherQueryResponse)
  async getWeather(@Args('city') city: string): Promise<any> {
    return this.weatherService.getWeatherData(city);
  }

  @UseGuards(GqlThrottlerGuard)
  @Query(() => WeatherQueryResponse)
  async getWeatherForecast(@Args('city') city: string): Promise<any> {
    return this.weatherService.getForecastData(city);
  }
}
