import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { NotificacionCocina } from './notificacion-cocina.entity';
import { User } from 'src/users/entitites/user.entity';
import { EstadoCocina } from '../enums/estado-cocina.enum';

@Entity('historial_estados_cocina')
export class HistorialEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NotificacionCocina)
  @JoinColumn({ name: 'notificacionId' })
  notificacion: NotificacionCocina;

  @Column({
    type: 'enum',
    enum: EstadoCocina,
  })
  estadoAnterior: EstadoCocina;

  @Column({
    type: 'enum',
    enum: EstadoCocina,
  })
  estadoNuevo: EstadoCocina;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'usuarioModificacionId' })
  usuarioModificacion: User | null;

  @Column({ type: 'text', nullable: true }) 
  observaciones: string | null;

  @CreateDateColumn()
  fechaCambio: Date;
}