import { ModuloPermissaoInterface } from '../../interfaces/sistema/modulo.interfaces';
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Modulo from './Modulo';

@Entity({ name: 'modulospermissoes' })
export default class ModuloPermissao implements ModuloPermissaoInterface {
    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    idModuloPermissao: string;

    @JoinColumn({ name: 'idModulo' })
    @ManyToOne(() => Modulo)
    @Column({ length: 36 })
    idModulo: string

    @Column({ length: 255 })
    permissao: string;

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
    createAt: Date
  
    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
    updateAt: Date
}