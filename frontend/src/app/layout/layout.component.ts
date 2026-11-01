import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ItemMenu, MENU_POR_ROL, NOMBRE_DE_ROL } from '../core/navegacion';
import { AuthService } from '../core/services/auth.service';

// Estructura de las pantallas con sesión: barra superior con el menú según el rol + contenido.
@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './layout.component.html',
})
export class LayoutComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    protected readonly menu = computed<ItemMenu[]>(() => {
        const rol = this.auth.usuario()?.rol;
        return rol ? MENU_POR_ROL[rol] : [];
    });

    protected readonly nombreDelRol = computed<string>(() => {
        const rol = this.auth.usuario()?.rol;
        return rol ? NOMBRE_DE_ROL[rol] : '';
    });

    protected salir(): void {
        this.auth.logout();
        void this.router.navigate(['/login']);
    }
}
