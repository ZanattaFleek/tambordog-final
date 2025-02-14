import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioPermissaoInterface } from '../../interfaces/sistema/usuario.interfaces';
import Usuario from './Usuario';
import Modulo from './Modulo';
import ModuloPermissao from './ModuloPermissao';

@Entity({ name: 'usuariospermissoes' })
export default class UsuarioPermissao implements UsuarioPermissaoInterface {

    @PrimaryGeneratedColumn('uuid')
    idUsuarioPermissao: string

    @JoinColumn({ name: 'idUsuario' })
    @ManyToOne(() => Usuario)
    @Column({ length: 36 })
    idUsuario: string;
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