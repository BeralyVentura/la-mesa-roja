import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Orden } from 'src/ordenes/orden.entity';
import { User } from 'src/users/entitites/user.entity';
import { EstadoCocina } from '../enums/estado-cocina.enum';

@Entity('notificaciones_cocina')
export class NotificacionCocina {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orden, { eager: true })
  @JoinColumn({ name: 'ordenId' })
  orden: Orden;

  @Column({
    type: 'enum',
    enum: EstadoCocina,
    default: EstadoCocina.RECIBIDA,
  })
  estado: EstadoCocina;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'cocineroAsignadoId' })
  cocineroAsignado: User | null;

  @Column({ type: 'text', nullable: true })
  notas: string | null;

  @Column({ type: 'integer', default: 0 })
  tiempoEstimadoMinutos: number;

  @Column({ type: 'timestamp', nullable: true })
  horaInicio: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  horaFinalizacion: Date | null;

  @Column({ type: 'integer', default: 1 })
  prioridad: number; 

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}