import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import type { PayloadJwt } from '../../auth/interfaces/payload-jwt.interface.js';
import { Reserva } from '../entities/reservas.entity.js';
import { Medico } from '../entities/medicos.entity.js';
import { Usuario } from '../entities/usuarios.entity.js';
import { CreateReservaDto } from '../dtos/input/create-reserva.dto.js';
import { FiltrosReservasDto } from '../dtos/input/filtros-reservas.dto.js';
import { UpdateEstadoReservaDto } from '../dtos/input/update-estado-reserva.dto.js';
import { ListReservasDto } from '../dtos/output/list-reservas.dto.js';
import { EstadosReservas } from '../enums/estados-reservas.enum.js';
import { EstadosUsuarios } from '../enums/estados-usuarios.enum.js';
import { RolesUsuarios } from '../enums/roles-usuarios.enum.js';
import type { IReservasService } from '../interfaces/reservas-service.interface.js';
import { FechaLocal } from '../utils/fecha-local.js';
import { DIAS_MAXIMOS_ANTICIPACION, Horario, ReglasTurnos } from '../utils/reglas-turnos.js';

// Código de Postgres para "unique_violation" (índice reservas_medico_horario_activo de schema.sql)
const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class ReservasService implements IReservasService {

    constructor(
        @InjectRepository(Reserva) private readonly repository: Repository<Reserva>,
        @InjectRepository(Medico) private readonly medicosRepository: Repository<Medico>,
        @InjectRepository(Usuario) private readonly usuariosRepository: Repository<Usuario>,
    ) {}

    async crearReserva(dto: CreateReservaDto, usuario: PayloadJwt): Promise<ListReservasDto> {
        const idPaciente = await this.resolverPaciente(dto, usuario);
        const medico = await this.buscarMedicoActivo(dto.idMedico);

        const fechaHora = FechaLocal.desdeTextoFechaHora(dto.fechaHora);
        if (!fechaHora) {
            throw new BadRequestException('La fecha y hora debe tener el formato YYYY-MM-DDTHH:mm:ss, sin zona horaria');
        }
        if (fechaHora.esFinDeSemana) {
            throw new BadRequestException('Los sábados y domingos no se atiende');
        }
        if (!ReglasTurnos.esHoraDeTurno(fechaHora)) {
            throw new BadRequestException(
                `Los turnos son en punto, de ${Horario.PRIMER_TURNO}:00 a ${Horario.ULTIMO_TURNO}:00`,
            );
        }
        if (!ReglasTurnos.estaEnRangoPermitido(fechaHora, FechaLocal.ahora())) {
            throw new BadRequestException(
                `Solo se puede reservar a futuro y con un máximo de ${DIAS_MAXIMOS_ANTICIPACION} días de anticipación`,
            );
        }

        const texto = fechaHora.aTexto();
        if (await this.hayReservaActiva({ idMedico: medico.id, fechaHora: texto })) {
            throw new ConflictException('El médico ya tiene un turno reservado en ese horario');
        }
        if (await this.hayReservaActiva({ idPaciente, fechaHora: texto })) {
            throw new ConflictException('El paciente ya tiene otro turno en ese horario');
        }

        const reserva = this.repository.create({
            idMedico: medico.id,
            idPaciente,
            fechaHora: texto,
            estado: EstadosReservas.ACTIVO,
            // Se congela el valor actual del médico
            valorConsulta: medico.valorConsulta,
        });

        try {
            await this.repository.save(reserva);
        } catch (error) {
            // Dos reservas al mismo tiempo para el mismo horario: la base rechaza la segunda
            if (error instanceof QueryFailedError && (error.driverError as { code?: string })?.code === PG_UNIQUE_VIOLATION) {
                throw new ConflictException('El médico ya tiene un turno reservado en ese horario');
            }
            throw error;
        }

        return this.aDto(await this.buscarConRelaciones(reserva.id));
    }

    async listarReservas(filtros: FiltrosReservasDto, usuario: PayloadJwt): Promise<ListReservasDto[]> {
        const query = this.repository
            .createQueryBuilder('reserva')
            .innerJoinAndSelect('reserva.medico', 'medico')
            .innerJoinAndSelect('medico.usuario', 'usuarioMedico')
            .innerJoinAndSelect('reserva.paciente', 'paciente')
            .orderBy('reserva.fecha_hora', 'ASC');

        // Cada rol ve lo suyo; solo el administrador puede filtrar por médico y paciente
        let idMedico = filtros.idMedico;
        let idPaciente = filtros.idPaciente;
        if (usuario.rol === RolesUsuarios.PACIENTE) {
            idPaciente = usuario.sub;
        } else if (usuario.rol === RolesUsuarios.MEDICO) {
            if (!usuario.idMedico) {
                throw new ForbiddenException('El usuario no está registrado como médico');
            }
            idMedico = usuario.idMedico;
        }

        if (idMedico) query.andWhere('reserva.id_medico = :idMedico', { idMedico });
        if (idPaciente) query.andWhere('reserva.id_paciente = :idPaciente', { idPaciente });
        if (filtros.estado) query.andWhere('reserva.estado = :estado', { estado: filtros.estado });

        if (filtros.fecha) {
            const dia = FechaLocal.desdeTextoFecha(filtros.fecha);
            if (!dia) {
                throw new BadRequestException('La fecha debe tener el formato YYYY-MM-DD');
            }
            query.andWhere('reserva.fecha_hora >= :desde AND reserva.fecha_hora < :hasta', {
                desde: dia.aTexto(),
                hasta: dia.sumarDias(1).aTexto(),
            });
        }

        const reservas = await query.getMany();
        return reservas.map((reserva) => this.aDto(reserva));
    }

    async cancelarReserva(id: number, usuario: PayloadJwt): Promise<void> {
        const reserva = await this.buscarReserva(id);

        if (usuario.rol === RolesUsuarios.PACIENTE && reserva.idPaciente !== usuario.sub) {
            throw new ForbiddenException('Solo puede cancelar sus propios turnos');
        }
        if (reserva.estado !== EstadosReservas.ACTIVO) {
            throw new BadRequestException(`El turno no se puede cancelar porque está ${reserva.estado}`);
        }

        const fechaHora = this.fechaDeReserva(reserva);
        if (!ReglasTurnos.puedeCancelar(usuario.rol, fechaHora, FechaLocal.ahora())) {
            throw new BadRequestException(
                usuario.rol === RolesUsuarios.PACIENTE
                    ? 'Los turnos solo se pueden cancelar hasta el día anterior'
                    : 'El turno ya comenzó y no se puede cancelar',
            );
        }

        reserva.estado = EstadosReservas.CANCELADO;
        await this.repository.save(reserva);
    }

    async cambiarEstado(id: number, dto: UpdateEstadoReservaDto, usuario: PayloadJwt): Promise<void> {
        const reserva = await this.buscarReserva(id);

        if (!usuario.idMedico || reserva.idMedico !== usuario.idMedico) {
            throw new ForbiddenException('Solo puede modificar sus propios turnos');
        }
        if (reserva.estado !== EstadosReservas.ACTIVO) {
            throw new BadRequestException(`El turno ya está ${reserva.estado}`);
        }

        reserva.estado = dto.estado;
        await this.repository.save(reserva);
    }

    async horariosDisponibles(idMedico: number, fecha: string): Promise<string[]> {
        const medico = await this.buscarMedicoActivo(idMedico);

        const dia = FechaLocal.desdeTextoFecha(fecha);
        if (!dia) {
            throw new BadRequestException('La fecha debe tener el formato YYYY-MM-DD');
        }
        if (dia.esFinDeSemana) {
            return [];
        }

        const ocupadas = await this.repository
            .createQueryBuilder('reserva')
            .where('reserva.id_medico = :idMedico', { idMedico: medico.id })
            .andWhere('reserva.estado <> :cancelado', { cancelado: EstadosReservas.CANCELADO })
            .andWhere('reserva.fecha_hora >= :desde AND reserva.fecha_hora < :hasta', {
                desde: dia.aTexto(),
                hasta: dia.sumarDias(1).aTexto(),
            })
            .getMany();
        const horasOcupadas = new Set(ocupadas.map((reserva) => this.fechaDeReserva(reserva).hora));

        const ahora = FechaLocal.ahora();
        return ReglasTurnos.horasDeTurno()
            .map((hora) => dia.conHora(hora))
            .filter((turno) => ReglasTurnos.estaEnRangoPermitido(turno, ahora) && !horasOcupadas.has(turno.hora))
            .map((turno) => turno.aTextoHora());
    }

    // ---------- auxiliares ----------

    // El paciente reserva para sí mismo; el administrador indica para quién
    private async resolverPaciente(dto: CreateReservaDto, usuario: PayloadJwt): Promise<number> {
        if (usuario.rol === RolesUsuarios.PACIENTE) {
            return usuario.sub;
        }
        if (!dto.idPaciente) {
            throw new BadRequestException('Debe indicar el paciente');
        }
        const paciente = await this.usuariosRepository.findOne({ where: { id: dto.idPaciente } });
        if (!paciente || paciente.rol !== RolesUsuarios.PACIENTE || paciente.estado !== EstadosUsuarios.ACTIVO) {
            throw new BadRequestException('El paciente no existe o no está activo');
        }
        return paciente.id;
    }

    private async buscarMedicoActivo(id: number): Promise<Medico> {
        const medico = await this.medicosRepository.findOne({ where: { id }, relations: { usuario: true } });
        if (!medico || medico.usuario?.estado !== EstadosUsuarios.ACTIVO) {
            throw new NotFoundException(`El médico con id ${id} no existe`);
        }
        return medico;
    }

    private async buscarReserva(id: number): Promise<Reserva> {
        const reserva = await this.repository.findOne({ where: { id } });
        if (!reserva) {
            throw new NotFoundException(`El turno con id ${id} no existe`);
        }
        return reserva;
    }

    private async buscarConRelaciones(id: number): Promise<Reserva> {
        return await this.repository.findOneOrFail({
            where: { id },
            relations: { medico: { usuario: true }, paciente: true },
        });
    }

    private async hayReservaActiva(where: { idMedico?: number; idPaciente?: number; fechaHora: string }): Promise<boolean> {
        const query = this.repository
            .createQueryBuilder('reserva')
            .where('reserva.fecha_hora = :fechaHora', { fechaHora: where.fechaHora })
            .andWhere('reserva.estado <> :cancelado', { cancelado: EstadosReservas.CANCELADO });
        if (where.idMedico) query.andWhere('reserva.id_medico = :idMedico', { idMedico: where.idMedico });
        if (where.idPaciente) query.andWhere('reserva.id_paciente = :idPaciente', { idPaciente: where.idPaciente });
        return (await query.getCount()) > 0;
    }

    private fechaDeReserva(reserva: Reserva): FechaLocal {
        const fecha = FechaLocal.desdeTextoFechaHora(reserva.fechaHora);
        if (!fecha) {
            throw new Error(`Fecha inválida en la reserva ${reserva.id}: ${reserva.fechaHora}`);
        }
        return fecha;
    }

    // Nunca se expone la clave del paciente
    private aDto(reserva: Reserva): ListReservasDto {
        return {
            id: reserva.id,
            fechaHora: reserva.fechaHora,
            estado: reserva.estado,
            valorConsulta: reserva.valorConsulta,
            medico: {
                id: reserva.medico.id,
                apellidos: reserva.medico.usuario.apellidos,
                nombres: reserva.medico.usuario.nombres,
                matricula: reserva.medico.matricula,
                valorConsulta: reserva.medico.valorConsulta,
            },
            paciente: {
                id: reserva.paciente.id,
                documento: reserva.paciente.documento,
                apellidos: reserva.paciente.apellidos,
                nombres: reserva.paciente.nombres,
            },
        };
    }
}
