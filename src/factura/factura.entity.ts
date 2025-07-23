import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Orden } from 'src/ordenes/orden.entity';

@Entity()
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orden, { eager: true })
  orden: Orden;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  descuento: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  fecha: Date;
}
