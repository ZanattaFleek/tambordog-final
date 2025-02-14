import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GrupoInterface } from '../../interfaces/sistema/grupo.interfaces';

@Entity({ name: 'grupos' })
export default class Grupo implements GrupoInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    idGrupo: string;

    @Column({ length: 50 })
    nome: string

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
    createAt: Date
  
    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
    updateAt: Date
}