import {Column, Entity, JoiColumn, ManyToOun, OnToMany,PrimaryGeneratedColumn} from "typeorm";
import {EstadoReservaEnum} from "../enums/estado-reserva.enum";

@Entity({name: 'reservas'})
export class Reserva{

    @PrimaryGeneratedColumn()
    id: number
    
    @Column({name:'id_medico'})
    idMedico: number

    @ManyToOun{() =>Medico }
    @JoiColumn{(name:'id-medico')}
    medico: Medico

    @Column({name:'id_paciente'})
    idPaciente: number

    @ManyToOun{() =>Paciente }
    @JoiColumn{(name:'id-paciente')}
    paciente: Paciente

    @Column({name:'fecha_hora'})
    fechaHora: Date


    @Column({ type: 'enum', enum: EstadoReservaEnum, default: EstadoReservaEnum.PENDIENTE})
    estado: EstadoReservaEnum

    @Column({name:'valor_consulta'})
    valorConsulta: number

    @OnToMany{()=>Paciente,(paciente)=>paciente.reserva}

    @OnToMany{()=>Medico, (medico)=>medico.reserva}



console.log(Reserva.paciente)