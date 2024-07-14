import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasClienteComponent } from './cuentas-cliente.component';

describe('CuentasClienteComponent', () => {
  let component: CuentasClienteComponent;
  let fixture: ComponentFixture<CuentasClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentasClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
