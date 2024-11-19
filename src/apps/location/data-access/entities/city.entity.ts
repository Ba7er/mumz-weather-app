import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Country } from './country.entity';
import { Location } from './location.entity';
import { CoreEntity } from '../../../../libs/entities/core.entity';

@Entity('cities')
export class City extends CoreEntity {
  @Column()
  name: string;

  @ManyToOne(() => Country, (country) => country.cities, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @OneToMany(() => Location, (location) => location.city)
  locations: Location[];
}
