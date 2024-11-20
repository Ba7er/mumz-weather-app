# Weather API Wrapper

A NestJS application that wraps around a third-party weather API, providing REST and GraphQL endpoints for weather data along with user-specific location management.

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [API Documentation](#api-documentation)
3. [Caching Strategy](#caching-strategy)
4. [Assumptions and Design Decisions](#assumptions-and-design-decisions)

---

## Setup Instructions

Clone this repo and follow these steps to set up and run the application:

1. **ENV Variable**

   In the root directory make sure to create `.env` file. Use these values

   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=postgres
   JWT_SECRET=M4vdkbl1NQMgb023Zao27jhTi5T6sx9aBw8Mb1RayY8
   JWT_EXPIRY_TIME=1d
   WEATHER_API_KEY=0b79639184d742f1b7b185322192211
   ```

2. **Ensure Docker is Installed**

   Make sure Docker is installed and running on your system.

3. **Run PostgreSQL Database**  
   In terminal `cd` into root directory Use the following command to start a PostgreSQL container:
   ```bash
   docker-compose up --build
   ```
4. **Run Migration Scripts**

   In terminal `cd` into root directory and run below command to create the database and populate city and country table with data

   ```bash
   npm run migrate
   ```

5. **Build the app**

   ```bash
   npm run build
   ```

6. **Start the app**

   ```bash
   npm run start
   ```

## API Documentation

once the app is up and running you can open the documentation using this link http://localhost:9100/api#

## Caching Strategy

1. NestJS built-in caching is used to store weather data.
2. Fetched Weather data is cached globally for 1 hour.
3. For registered premium users, and for better user experience, their favorite location weather data is cached and refreshed every 15 minutes, aligned with the weather API’s frequent updates (every 10-15 minutes).
4. Non-registered users will not receive the latest weather updates for cities, ensuring efficient use of the weather API.

## Assumptions and Design Decisions

1. **`POST /location` API**

   - The system uses city and country tables to validate city names when users add locations via the `POST /locations` API. This ensures that only correct cities are stored, preventing errors during weather data retrieval and ensuring accurate city names are used when refreshing cached data.
   - The system allows users to add up to 10 locations to their favorites via the `POST /locations API`. This limitation ensures optimal performance and prevents excessive API calls to the weather API service

   - For simplicity, The system does not support saving locations by Latitude and Longitude, it saves location as a city

2. **`GET forecast/:city` API**

   - Since we are utilizing Weather API free plan, we only get 3 days forecast, and in some cases only 2.
   - the number of forecast `days` is 5 and is hardcoded in the system.

3. **Weather Data**:

   - The goal is to increase the percentage of `CACHE HIT` for better user experienc (For both registered and Non registered users), therefore, Weather data (Including forecasts) are not saved in a DB table and considered redundant, they are either cached or fetched from weather API
