import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateCityCountry1732047075278 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert countries
    await queryRunner.query(`
            INSERT INTO countries (name, code, "createdAt", "updatedAt")
            VALUES 
                ('United States', 'US', now(), now()),
                ('Canada', 'CA', now(), now()),
                ('Germany', 'DE', now(), now()),
                ('France', 'FR', now(), now()),
                ('Australia', 'AU', now(), now())
        `);

    // Insert cities (10 cities per country for 50 total cities)
    await queryRunner.query(`
            INSERT INTO cities (name, "countryId", "createdAt", "updatedAt")
            VALUES
             
                ('New York', 1, now(), now()),
                ('Los Angeles', 1, now(), now()),
                ('Chicago', 1, now(), now()),
                ('Houston', 1, now(), now()),
                ('Phoenix', 1, now(), now()),
                ('Philadelphia', 1, now(), now()),
                ('San Antonio', 1, now(), now()),
                ('San Diego', 1, now(), now()),
                ('Dallas', 1, now(), now()),
                ('San Jose', 1, now(), now()),
                ('Toronto', 2, now(), now()),
                ('Montreal', 2, now(), now()),
                ('Calgary', 2, now(), now()),
                ('Ottawa', 2, now(), now()),
                ('Edmonton', 2, now(), now()),
                ('Winnipeg', 2, now(), now()),
                ('Vancouver', 2, now(), now()),
                ('Quebec City', 2, now(), now()),
                ('Halifax', 2, now(), now()),
                ('Victoria', 2, now(), now()),
                ('Berlin', 3, now(), now()),
                ('Hamburg', 3, now(), now()),
                ('Munich', 3, now(), now()),
                ('Cologne', 3, now(), now()),
                ('Frankfurt', 3, now(), now()),
                ('Stuttgart', 3, now(), now()),
                ('Dusseldorf', 3, now(), now()),
                ('Dortmund', 3, now(), now()),
                ('Essen', 3, now(), now()),
                ('Bremen', 3, now(), now()),
             
                ('Paris', 4, now(), now()),
                ('Marseille', 4, now(), now()),
                ('Lyon', 4, now(), now()),
                ('Toulouse', 4, now(), now()),
                ('Nice', 4, now(), now()),
                ('Nantes', 4, now(), now()),
                ('Strasbourg', 4, now(), now()),
                ('Montpellier', 4, now(), now()),
                ('Bordeaux', 4, now(), now()),
                ('Lille', 4, now(), now()),
             
                ('Sydney', 5, now(), now()),
                ('Melbourne', 5, now(), now()),
                ('Brisbane', 5, now(), now()),
                ('Perth', 5, now(), now()),
                ('Adelaide', 5, now(), now()),
                ('Gold Coast', 5, now(), now()),
                ('Canberra', 5, now(), now()),
                ('Hobart', 5, now(), now()),
                ('Darwin', 5, now(), now()),
                ('Cairns', 5, now(), now())
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove all cities and countries
    await queryRunner.query(`DELETE FROM cities`);
    await queryRunner.query(`DELETE FROM countries`);
  }
}
