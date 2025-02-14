import { ModuloInterface } from '../../interfaces/sistema/modulo.interfaces';
import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'modulos' })
export default class Modulo implements ModuloInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    idModulo: string;

    @Column({ length: 255 })
    modulo: string

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
    createAt: Date
  
    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
    updateAt: Date
}