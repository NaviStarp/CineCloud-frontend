import { Component, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-prueba',
  imports: [],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css'
})
export class PruebaComponent  {
  token: string | null = '';
  username: string | null = '';
  constructor(){
    afterNextRender(() => {
      this.token = localStorage.getItem('token');
      if (!this.token) {
        window.location.href = '/login';
      }
      this.username = localStorage.getItem('username');
    });
  }  

}
