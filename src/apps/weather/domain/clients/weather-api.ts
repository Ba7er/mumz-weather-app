import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { WeatherData } from '../types/weather-data';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from '../../../../libs/constants/constants';

// Error codes table provided by Weather API service
//https://www.weatherapi.com/docs/
const errorCodeToStatusCode: Record<number, HttpStatus> = {
  1002: HttpStatus.UNAUTHORIZED, // API key not provided
  1003: HttpStatus.BAD_REQUEST, // Parameter 'q' not provided
  1005: HttpStatus.BAD_REQUEST, // API request URL is invalid
  1006: HttpStatus.NOT_FOUND, // No location found
  2006: HttpStatus.UNAUTHORIZED, // Invalid API key
  2007: HttpStatus.FORBIDDEN, // Exceeded API calls per month
  2008: HttpStatus.FORBIDDEN, // API key disabled
  2009: HttpStatus.FORBIDDEN, // API key does not have access to resource
  9000: HttpStatus.BAD_REQUEST, // Invalid JSON body
  9001: HttpStatus.BAD_REQUEST, // Too many locations in bulk request
  9999: HttpStatus.INTERNAL_SERVER_ERROR, // Internal application error
};

@Injectable()
export class WeatherApiClient {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  // Helper function to generate the full URL for the weather API request
  private buildUrl(endpoint: string, params: Record<string, string | number>) {
    const url = new URL(
      endpoint,
      this.configService.get<string>('weatherApi.baseUrl'),
    );
    url.searchParams.append(
      'key',
      this.configService.get<string>('weatherApi.key'),
    );
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });
    return url.toString();
  }

  // Fetch current weather data
  async fetchCurrentWeather(
    city: string,
  ): Promise<Omit<WeatherData, 'forecast'>> {
    try {
      const url = this.buildUrl('/v1/current.json', { q: city });
      const { data }: AxiosResponse<Omit<WeatherData, 'forecast'>> =
        await firstValueFrom(this.httpService.get(url));
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Fetch forecast data
  async fetchForecastWeather(city: string, days: number): Promise<WeatherData> {
    try {
      const url = this.buildUrl('/v1/forecast.json', { q: city, days });
      const { data }: AxiosResponse<WeatherData> = await firstValueFrom(
        this.httpService.get(url),
      );
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: AxiosError) {
    if (error.response && error.response.data) {
      const errorResponse = error.response.data as {
        error: { message: string; code: number };
      };

      throw new HttpException(
        {
          message: errorResponse.error.message,
          statusCode: errorCodeToStatusCode[errorResponse.error.code],
        },
        errorCodeToStatusCode[errorResponse.error.code],
      );
    }

    // If no response data is found, throw a generic error
    throw new HttpException(
      {
        message: ERROR_MESSAGES.WEATHER_FETCH_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
