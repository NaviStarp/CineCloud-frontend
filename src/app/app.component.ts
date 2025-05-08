import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group
} from '@angular/animations';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ opacity: 0 }),
            animate('300ms ease-in', style({ opacity: 1 }))
          ], { optional: true })
        ])
      ])      
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'CineCloud';
  constructor(private auth: AuthService,private router:Router) {}
  async ngOnInit(): Promise<void> {
    await this.redirectToLogin();
  }
  async redirectToLogin() {
    if(!(await this.auth.loggedIn())){
      try {
      const ip = environment.url || localStorage.getItem('serverIp')
      const port = environment.port || localStorage.getItem('serverPort');
      
        if(ip && port && await this.auth.testServer(ip,port)){
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/server/config']);
      }
    }catch(e) {
    }
    }
  }
  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
  
}
