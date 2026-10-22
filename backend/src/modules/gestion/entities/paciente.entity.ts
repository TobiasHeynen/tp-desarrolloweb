import {Column, Entity, JoiColumn, ManyToOun, OnToMany,PrimaryGeneratedColumn} from "typeorm";
+import {EstadoPacienteEnum} from "../enums/estado-paciente.enum";
import { RolesUsuarios } from "../enums/roles-usuarios.enum.js";
import { EstadosUsuarios } from "../enums/estados-usuarios.enum.js";
import type { Administrador} from './administrador.entity.js';


@Entity({name: 'pacientes'})
export class Paciente{
    
    @PrimaryGeneratedColumn()
    id: number

    documento: number

    @Column({name:'apellidos'})
    apellido: string

    @Column({name:'nombres'})
    nombre: string

    email: string

    clave: string

    @Entity({name:'estados-usuarios'})
    @Column({type: 'enum', enum: EstadosUsuariosEnum, default: EstadosUsuariosEnum.ACTIVO})
    estado: EstadosUsuariosEnum

    @Entity({name:'roles-usuarios'})
    @Column({type: 'enum', enum: RolesUsuariosEnum, default: RolesUsuariosEnum.PACIENTE})
    rol: RolesUsuariosEnum

    @ManyToOun{() =>RolesUsuarios}
    @JoiColumn({name:'roles-usuarios'})


    @ManyToOun{() =>EstadosUsuarios}
    @JoiColumn({name:'estados-usuarios'})

    @OnToMany{()=>RolesUsuarios, (rolesusuarios)=>rolesusuarios.paciente}
    rolesusuarios: RolesUsuarios{}

    @OnToMany{()=>Administrador, (administrador: Administrador)=>administrador.paciente}
    administrador: Administrador{}






console.log(paciente.reserva)
console.log(paciente.usuario)


