import { Entity, Column, OneToMany } from 'typeorm';
import { Location } from '../../../location/data-access/entities/location.entity';
import { CoreEntity } from '../../../../libs/entities/core.entity';
@Entity('users')
export class User extends CoreEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];
}
