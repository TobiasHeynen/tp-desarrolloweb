import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EstadosReservas } from '../enums/estados-reservas.enum.js';
import { Medico } from './medicos.entity.js';
import { Usuario } from './usuarios.entity.js';

@Entity({ name: 'reservas' })
export class Reserva {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'id_medico', type: 'int' })
    idMedico: number;

    @ManyToOne(() => Medico)
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    // El paciente es un usuario con rol PACIENTE (no existe tabla pacientes).
    @Column({ name: 'id_paciente', type: 'int' })
    idPaciente: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Usuario;

    @Column({ name: 'fecha_hora', type: 'timestamp' })
    fechaHora: Date;

    @Column({ type: 'enum', enum: EstadosReservas, enumName: 'estados_reservas', default: EstadosReservas.ACTIVO })
    estado: EstadosReservas;

    // Se congela el valor del médico al momento de reservar.
    @Column({ name: 'valor_consulta', type: 'int' })
    valorConsulta: number;
}
