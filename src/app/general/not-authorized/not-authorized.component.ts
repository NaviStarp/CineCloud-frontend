import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  imports: [],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.css'
})
export class NotAuthorizedComponent {
  constructor(private router: Router) {}
  volver() {
    console.log('Volver a la página principal');
    this.router.navigate(['/']);
  }

}
