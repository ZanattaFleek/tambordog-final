import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { GrupoUsuarioInterface } from '../../interfaces/sistema/grupo.interfaces';
import Grupo from './Grupo';
import Usuario from './Usuario';

@Entity({ name: 'gruposusuarios' })
export default class GrupoUsuario implements GrupoUsuarioInterface {

    @PrimaryColumn({ length: 36 })
    @JoinColumn({ name: 'idGrupo' })
    @ManyToOne(() => Grupo)
    idGrupo: string;

    @PrimaryColumn({ length: 36 })
    @JoinColumn({ name: 'idUsuario' })
    @ManyToOne(() => Usuario)
    idUsuario: string;

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
    createAt: Date
  
    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
    updateAt: Date
}