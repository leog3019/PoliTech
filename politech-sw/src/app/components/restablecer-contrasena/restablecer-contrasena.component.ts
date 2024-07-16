import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.component.html',
  styleUrls: ['./restablecer-contrasena.component.css']
})
export class RestablecerContrasenaComponent implements OnInit {
  nuevaContrasena: string = '';
  confirmarNuevaContrasena: string = '';
  actionCode: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.actionCode = this.route.snapshot.queryParams['oobCode'];
  }

  async restablecerContrasena() {
    if (this.nuevaContrasena !== this.confirmarNuevaContrasena) {
      alert('Las nuevas contraseñas no coinciden');
      return;
    }

    try {
      await this.authService.restablecerContrasena(this.actionCode, this.nuevaContrasena);
      alert('Contraseña restablecida exitosamente');
      this.router.navigate(['/inicio-sesion']);
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      alert('Hubo un problema al restablecer la contraseña');
    }
  }
}
