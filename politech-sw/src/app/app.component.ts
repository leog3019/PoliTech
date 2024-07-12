import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '@components/login/login.component';
import { HeaderComponent } from '@components/Shared-components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'politech-sw';
}
