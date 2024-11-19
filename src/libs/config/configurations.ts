export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiryTime: process.env.JWT_EXPIRY_TIME,
  },
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  weatherApi: {
    key: process.env.WEATHER_API_KEY,
    baseUrl: 'https://api.weatherapi.com',
  },
  gqlSchema: {
    path: 'src/libs/graphql/schema.gql',
    sortSchema: true,
    playground: false,
  },
  hash: {
    SALT_ROUNDS: 10,
  },
});
