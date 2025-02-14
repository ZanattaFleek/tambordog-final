import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioInterface } from '../../interfaces/sistema/usuario.interfaces';

@Entity({ name: 'usuarios' })
export default class Usuario implements UsuarioInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idUsuario: string;

  @Column({ length: 50 })
  nome: string

  @Column({ length: 14 })
  cpf: string

  @Column({ length: 25 })
  senha: string

  @Column({ length: 1, type: 'char' })
  perfil: 'A' | 'U'

  @Column({ nullable: true })
  ativo: boolean

  @Column({ type: 'int', default: 0 })
  tentativasLogin: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}