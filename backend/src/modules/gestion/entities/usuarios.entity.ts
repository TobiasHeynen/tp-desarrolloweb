import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EstadosUsuarios } from '../enums/estados-usuarios.enum.js';
import { RolesUsuarios } from '../enums/roles-usuarios.enum.js';

@Entity({ name: 'usuarios' })
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', unique: true })
    documento: string;

    @Column({ type: 'text' })
    apellidos: string;

    @Column({ type: 'text' })
    nombres: string;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text' })
    clave: string;

    @Column({ type: 'enum', enum: EstadosUsuarios, enumName: 'estados_usuarios' })
    estado: EstadosUsuarios;

    @Column({ type: 'enum', enum: RolesUsuarios, enumName: 'roles_usuarios' })
    rol: RolesUsuarios;
}
