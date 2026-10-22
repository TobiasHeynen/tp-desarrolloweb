import {Column, Entity, JoiColumn, ManyToOun, OnToMany,PrimaryGeneratedColumn} from "typeorm";
import {RolesUsuariosEnum} from "../enums/roles-usuarios.enum";
import { Usuario } from "./usuarios.entity.js";
    

@Entity({name: 'medicos'})
export class Medico{

    @PrimaryGeneratedColumn()
    id: number

    @Column({name:'id_usuario'})
    idUsuario: number

    @ManyToOun{() => Usuario }
    @JoiColumn{(name:'id-usuario')}
    usuario: Usuario


    matricula: string

    @Column({name:'valor_consulta'})
    valorConsulta: number



}@ManyToOun{() => ValorConsulta}
    @JoiColumn{(name:'valor-consulta')}
    valorconsulta: ValorConsulta
 

    @OnToMany{()=>Usuario,(usuario)=>usuario.medico}

    @OnToMany{()=>ValorConsulta,(valorConsulta)=>valorconsulta.medico}



console.log(medicos.usuario.nombre)
console.log(medicos.paciente)