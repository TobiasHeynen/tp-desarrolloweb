import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuarios.entity.js';

@Entity({ name: 'medicos' })
export class Medico {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'id_usuario', type: 'int' })
    idUsuario: number;

    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @Column({ type: 'int' })
    matricula: number;

    @Column({ name: 'valor_consulta', type: 'int' })
    valorConsulta: number;
}
