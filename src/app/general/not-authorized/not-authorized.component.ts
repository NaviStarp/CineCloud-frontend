import { Component } from '@angular/core';

@Component({
  selector: 'app-not-authorized',
  imports: [],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.css'
})
export class NotAuthorizedComponent {

  volver() {
    console.log('Volver a la página principal');
    window.location.href = '/';
  }

}
