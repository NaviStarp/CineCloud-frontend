import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './form-footer.component.html',
  styleUrls: ['./form-footer.component.css']
})
export class FormFooterComponent {
  @Input() text: string = '¿Ya tienes cuenta?';
  @Input() linkText: string = 'Inicia sesión';
  @Input() linkRoute: string = '/login';
}