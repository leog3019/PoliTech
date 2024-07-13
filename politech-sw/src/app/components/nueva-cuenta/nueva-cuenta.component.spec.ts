import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaCuentaComponent } from './nueva-cuenta.component';

describe('NuevaCuentaComponent', () => {
  let component: NuevaCuentaComponent;
  let fixture: ComponentFixture<NuevaCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
