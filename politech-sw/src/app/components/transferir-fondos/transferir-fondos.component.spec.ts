import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferirFondosComponent } from './transferir-fondos.component';

describe('TransferirFondosComponent', () => {
  let component: TransferirFondosComponent;
  let fixture: ComponentFixture<TransferirFondosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferirFondosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferirFondosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
