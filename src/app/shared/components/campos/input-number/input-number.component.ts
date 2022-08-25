import { ValidarCamposService } from './../validar-campos.service';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'dio-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent {
  @Input() titulo: string;
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Input() minimun = 0;
  @Input() maximun = 10;
  @Input() step = 1;

  constructor(public validacao: ValidarCamposService) { }

  get formControl(): AbstractControl {
    return this.formGroup.controls[this.controlName];
  }
}
