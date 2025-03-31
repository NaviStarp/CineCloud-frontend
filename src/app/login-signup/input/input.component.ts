import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FaIconComponent],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() errorMessage: string = 'Este campo es obligatorio';
  @Input() icon:string = '';

  constructor() {}

  ngOnInit(): void {
    console.log(this.formGroup);
    console.log(this.controlName);
  }

  get control() {
    return this.formGroup.get(this.controlName);
  }

  get isInvalid() {
    const control = this.control;
    return control && control.invalid && control.touched;
  }

}