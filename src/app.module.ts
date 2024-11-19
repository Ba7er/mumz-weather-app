import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { WeatherModule } from './apps/weather/weather.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './apps/user/data-access/entities/user.entity';
import { UserModule } from './apps/user/user.module';
import { AuthModule } from './apps/auth/auth.module';
import { City } from './apps/location/data-access/entities/city.entity';
import { Country } from './apps/location/data-access/entities/country.entity';
import { Location } from './apps/location/data-access/entities/location.entity';
import { LocationModule } from './apps/location/location.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import configurations from './libs/config/configurations';

@Module({
  imports: [
    LocationModule,
    UserModule,
    AuthModule,
    WeatherModule,
    ConfigModule.forRoot({
      load: [configurations],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [User, Location, City, Country],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: configService.get<boolean>('gqlSchema.playground'),
        autoSchemaFile: join(
          process.cwd(),
          configService.get<string>('gqlSchema.path'),
        ),
        sortSchema: configService.get<boolean>('gqlSchema.sortSchema'),
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 15 * 60 * 1000, // 15 minutes
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 1000,
        limit: 100,
      },
    ]),
  ],
})
export class AppModule {}
