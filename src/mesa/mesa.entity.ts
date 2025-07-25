import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Orden } from "src/ordenes/orden.entity";

@Entity()
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  disponible: boolean;

  @OneToMany(() => Orden, orden => orden.mesa)
  ordenes: Orden[];
}