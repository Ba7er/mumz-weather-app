import { forwardRef, Module } from '@nestjs/common';
import { WeatherController } from './entry-points/api/weather.controller';
import { WeatherService } from './domain/services/weather.service';
import { HttpModule } from '@nestjs/axios';
import { WeatherUpdateTask } from './entry-points/schedules-tasks/weather-update-job';
import { LocationModule } from '../location/location.module';
import { WeatherApiClient } from './domain/clients/weather-api';
import { WeatherResolver } from './entry-points/graphql/weather.resolver';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from '../../libs/guards/gql-throttler.guard';

@Module({
  imports: [HttpModule, forwardRef(() => LocationModule)],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherUpdateTask,
    WeatherApiClient,
    WeatherResolver,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
