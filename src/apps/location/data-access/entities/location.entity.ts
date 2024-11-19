import { Entity, ManyToOne, Unique } from 'typeorm';
import { User } from '../../../user/data-access/entities/user.entity';
import { City } from './city.entity';
import { CoreEntity } from '../../../../libs/entities/core.entity';

@Unique(['user', 'city'])
@Entity('locations')
export class Location extends CoreEntity {
  @ManyToOne(() => User, (user) => user.locations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => City, (city) => city.locations, { onDelete: 'CASCADE' })
  city: City;
}
