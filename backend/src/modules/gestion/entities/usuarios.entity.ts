import {Column, Entity, JoiColumn, ManyToOun, OnToMany,PrimaryGeneratedColumn} from "typeorm";
import {EstadosUsuariosEnum} from "../enums/estados-usuarios.enum";
    

@Entity(name: 'usuarios')
export class Usuario{

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

    @OnToMany {()=>Medico, (medicos)=>medicos.usuario}

    @OnToMany {()=>RolesUsuarios, (roles-usuario)=>RolesUsuarios.usuario}

}

console.log(Usuario.medicos)
