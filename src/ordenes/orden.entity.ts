import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { OrdenItem } from './orden-item.entity';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';

@Entity()
export class Orden {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mesa: number;

  @Column()
  usuario: string;

  @OneToMany(() => OrdenItem, (item) => item.orden, {
    cascade: true,
    eager: true,
  })
  items: OrdenItem[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  descuentoTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column('simple-array', { nullable: true })
  promocionesAplicadas: string[];

  @Column({
    type: 'enum',
    enum: EstadoOrden,
    default: EstadoOrden.SOLICITADA,
  })
  estado: EstadoOrden;

  @CreateDateColumn()
  fechaCreacion: Date;
}
