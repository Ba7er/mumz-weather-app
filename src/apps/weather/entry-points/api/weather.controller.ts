import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WeatherService } from '../../domain/services/weather.service';

@ApiTags('Weather')
@Controller()
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @ApiOperation({
    summary: 'Get current weather data for a city',
    description: 'Fetches the current weather data for the given city.',
  })
  @Get('weather/:city')
  handleWeatherRequest(@Param('city') city: string) {
    return this.weatherService.getWeatherData(city);
  }

  @ApiOperation({
    summary: 'Get weather forecast for a city',
    description:
      'Fetches the weather forecast for the given city and number of days.',
  })
  @Get('forecast/:city')
  handleForeCastRequest(@Param('city') city: string) {
    return this.weatherService.getForecastData(city);
  }
}
