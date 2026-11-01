import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Pantalla provisoria para las rutas de médico y administrador (persona 5).
// Cada ruta de app.routes.ts que use esta pantalla se reemplaza por el componente real.
@Component({
    selector: 'app-en-construccion',
    template: `
        <section class="tarjeta">
            <h1>{{ titulo }}</h1>
            <p class="ayuda">pantalla para completar.</p>
        </section>
    `,
})
export class EnConstruccionComponent {
    protected readonly titulo: string = inject(ActivatedRoute).snapshot.title ?? 'En construcción';
}
