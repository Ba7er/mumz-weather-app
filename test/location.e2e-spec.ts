import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from '../src/apps/location/domain/services/location.service';
import { Repository } from 'typeorm';
import { Location } from '../src/apps/location/data-access/entities/location.entity';
import { City } from '../src/apps/location/data-access/entities/city.entity';
import { WeatherService } from '../src/apps/weather/domain/services/weather.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LocationService', () => {
  let locationService: LocationService;
  let locationRepository: jest.Mocked<Repository<Location>>;
  let cityRepository: jest.Mocked<Repository<City>>;
  let weatherService: jest.Mocked<WeatherService>;
});
