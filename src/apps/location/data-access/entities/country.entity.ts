import { Entity, Column, OneToMany } from 'typeorm';
import { City } from './city.entity';
import { CoreEntity } from '../../../../libs/entities/core.entity';

@Entity('countries')
export class Country extends CoreEntity {
  @Column()
  name: string;

  @Column({ length: 2 })
  code: string;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];
}
