import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Orden } from './orden.entity';
import { Platillo } from 'src/platillos/platillo.entity'; 

@Entity()
export class OrdenItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platilloId: number;

  @Column()
  nombre: string;

  @Column()
  categoria: string;

  @Column('decimal')
  precio: number;

  @Column()
  cantidad: number;

  @ManyToOne(() => Orden, (orden) => orden.items)
  orden: Orden;

  @ManyToOne(() => Platillo, { eager: true }) 
  platillo: Platillo;
}
