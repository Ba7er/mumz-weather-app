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
  let locationRepository: Repository<Location>;
  let cityRepository: Repository<City>;
  let weatherService: WeatherService;

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
    locationRepository = module.get<Repository<Location>>(
      getRepositoryToken(Location),
    );
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
    weatherService = module.get<WeatherService>(WeatherService);
  });

  describe('createLocation', () => {
    it('should create a location successfully when valid data is provided', async () => {
      const userId = 1;
      const createLocationDto = { cities: ['New York', 'Los Angeles'] };

      jest.spyOn(cityRepository, 'find').mockResolvedValue([
        { id: 1, name: 'New York' },
        { id: 2, name: 'Los Angeles' },
      ]);

      jest.spyOn(locationRepository, 'find').mockResolvedValue([]);
      jest.spyOn(locationRepository, 'save').mockResolvedValue([
        { id: 1, city: { id: 1, name: 'New York' }, user: { id: 1 } },
        { id: 2, city: { id: 2, name: 'Los Angeles' }, user: { id: 1 } },
      ]);

      const result = await locationService.createLocation(
        userId,
        createLocationDto,
      );

      expect(result).toHaveLength(2);
      expect(result[0].city.name).toBe('New York');
      expect(locationRepository.save).toHaveBeenCalled();
    });

    it('should throw a BadRequestException when a city does not exist', async () => {
      const userId = 1;
      const createLocationDto = { cities: ['Invalid City'] };

      jest.spyOn(cityRepository, 'find').mockResolvedValue([]);

      await expect(
        locationService.createLocation(userId, createLocationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getLocationsByUserId', () => {
    it('should return all locations and their weather data for a valid user', async () => {
      const userId = 1;

      jest.spyOn(locationRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { location_id: 1, city_name: 'New York' },
          { location_id: 2, city_name: 'Los Angeles' },
        ]),
      } as any);

      jest.spyOn(weatherService, 'getWeatherData').mockResolvedValueOnce({
        location: { name: 'New York' },
        current: { temp_c: 22 },
      });

      jest.spyOn(weatherService, 'getWeatherData').mockResolvedValueOnce({
        location: { name: 'Los Angeles' },
        current: { temp_c: 25 },
      });

      const result = await locationService.getLocationsByUserId(userId);

      expect(result).toHaveLength(2);
      expect(result[0].cityName).toBe('New York');
      expect(result[1].weather.current.temp_c).toBe(25);
    });

    it('should throw a BadRequestException if the user has no locations', async () => {
      const userId = 1;

      jest.spyOn(locationRepository, 'createQueryBuilder').mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      } as any);

      await expect(
        locationService.getLocationsByUserId(userId),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
