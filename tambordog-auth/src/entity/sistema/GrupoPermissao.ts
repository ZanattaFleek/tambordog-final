import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GrupoPermissaoInterface } from '../../interfaces/sistema/grupo.interfaces';
import Grupo from './Grupo';
import ModuloPermissao from './ModuloPermissao';

@Entity({ name: 'grupospermissoes' })
export default class GrupoPermissao implements GrupoPermissaoInterface {

    @PrimaryGeneratedColumn('uuid')
    idGrupoPermissao: string

    @JoinColumn({ name: 'idGrupo' })
    @ManyToOne(() => Grupo)
    @Column({ length: 36 })
    idGrupo: string;

    /*
    @JoinColumn({ name: 'idModulo' })
    @ManyToOne(() => Modulo)
    @Column({ length: 36 })
    idModulo: string
    */

    @JoinColumn({ name: 'idModuloPermissao' })
    @ManyToOne(() => ModuloPermissao)
    @Column({ length: 36 })
    idModuloPermissao: string

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
    createAt: Date

    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
    updateAt: Date

}