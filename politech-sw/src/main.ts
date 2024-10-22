import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { HeaderComponent } from '@components/Shared-components/header/header.component';
import { FooterComponent } from '@components/Shared-components/footer/footer.component';
import { CuentasClienteComponent } from '@components/cuentas-cliente/cuentas-cliente.component';
import { SidebarComponent } from '@components/Shared-components/sidebar/sidebar.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

bootstrapApplication(HomeComponent)
  .catch(err => console.error(err));

bootstrapApplication(LoginComponent)
  .catch((err) => console.error(err));

bootstrapApplication(HeaderComponent)
  .catch((err) => console.error(err));

bootstrapApplication(FooterComponent)
  .catch((err) => console.error(err));

bootstrapApplication(CuentasClienteComponent)
  .catch((err) => console.error(err));

bootstrapApplication(SidebarComponent)
  .catch((err) => console.error(err));