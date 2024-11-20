import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from '../services/location.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from '../../data-access/entities/location.entity';
import { City } from '../../data-access/entities/city.entity';
import { WeatherService } from '../../../weather/domain/services/weather.service';
import { BadRequestException } from '@nestjs/common';

describe('LocationService', () => {
  let locationService: LocationService;
  let cityRepository: Repository<City>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(City),
          useClass: Repository,
        },
        {
          provide: WeatherService,
          useValue: {
            getWeatherData: jest.fn(),
          },
        },
      ],
    }).compile();

    locationService = module.get<LocationService>(LocationService);

    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  describe('createLocation', () => {
    it('should throw a BadRequestException when a city does not exist', async () => {
      const userId = 1;
      const createLocationDto = { cities: ['Invalid City'] };

      jest.spyOn(cityRepository, 'find').mockResolvedValue([]);

      await expect(
        locationService.createLocation(userId, createLocationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
