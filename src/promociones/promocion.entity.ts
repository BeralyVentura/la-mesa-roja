import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Promocion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: 'porcentaje' | 'cantidad_fija' | 'combo';

  @Column('decimal')
  valor: number;

  @Column()
  fechaInicio: Date;

  @Column()
  fechaFin: Date;

  @Column()
  horaInicio: string; 

  @Column()
  horaFin: string;

  @Column('text', { array: true, nullable: true })
usuariosAplicables: string[];

@Column('text', { array: true, nullable: true })
categoriasAplicables: string[];

  @Column({ default: true })
  activo: boolean;

  @Column('json', { nullable: true })
comboRequerido: {
  categoria: string;
  cantidad: number;
}[];

}
