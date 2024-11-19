/**
 * This file defines the TypeORM DataSource configuration for the application.
 * It initializes the connection settings for the PostgreSQL database,
 * specifies the entities used for ORM mapping, and configures the
 * directory where migration files are located.
 */
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { City } from '../../apps/location/data-access/entities/city.entity';
import { Country } from '../../apps/location/data-access/entities/country.entity';
import { Location } from '../../apps/location/data-access/entities/location.entity';
import { User } from '../../apps/user/data-access/entities/user.entity';
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [City, Country, Location, User],
  migrations: ['dist/libs/migration/*.js'],
});

export default AppDataSource;
