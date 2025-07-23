import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Platillo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal')
  precioBase: number;

  @Column()
  categoria: string;

  @Column({ default: true })
  disponible: boolean;

  @Column({ nullable: true })
  imagenUrl: string;
}
