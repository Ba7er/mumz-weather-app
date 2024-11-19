import { forwardRef, Module } from '@nestjs/common';
import { LocationController } from './entry-points/api/location.controller';
import { LocationService } from './domain/services/location.service';
import { City } from './data-access/entities/city.entity';
import { Location } from './data-access/entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, City]),
    forwardRef(() => WeatherModule),
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
