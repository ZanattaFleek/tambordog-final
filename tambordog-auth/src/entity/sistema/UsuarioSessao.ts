import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioSessaoInterface } from '../../interfaces/sistema/usuario.interfaces';
import Usuario from './Usuario';

@Entity({ name: 'usuariosessoes' })
export default class UsuarioSessao implements UsuarioSessaoInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idSessao: string;

  @JoinColumn({ name: 'idUsuario' })
  @ManyToOne(() => Usuario)
  @Column({ length: 36 })
  idUsuario: string

  @Column({ length: 36 })
  token: string

  @Column({ nullable: true })
  ativo: boolean

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}