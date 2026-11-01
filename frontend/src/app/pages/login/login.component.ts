import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rutaInicial } from '../../core/navegacion';
import { AuthService } from '../../core/services/auth.service';
import { mensajeDeError } from '../../core/utils/errores';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    protected readonly formulario = inject(FormBuilder).nonNullable.group({
        documento: ['', [Validators.required]],
        clave: ['', [Validators.required]],
    });
    protected readonly enviando = signal<boolean>(false);
    protected readonly error = signal<string | null>(null);

    protected ingresar(): void {
        if (this.formulario.invalid || this.enviando()) {
            this.formulario.markAllAsTouched();
            return;
        }
        this.enviando.set(true);
        this.error.set(null);

        const { documento, clave } = this.formulario.getRawValue();
        this.auth.login(documento.trim(), clave).subscribe({
            next: () => {
                const rol = this.auth.usuario()?.rol;
                void this.router.navigate([rol ? rutaInicial(rol) : '/']);
            },
            error: (error: unknown) => {
                this.error.set(mensajeDeError(error));
                this.enviando.set(false);
            },
        });
    }
}
