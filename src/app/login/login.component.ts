import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
constructor(private auth: AuthService) { }
   username: string = '';
   password: string = '';
   token: string = '';
    user = {
      username: this.username,
      password: this.password
    };
  login(): void {
    this.user = {
      username: this.username,
      password: this.password
    };
    this.auth.login(this.user).then((res: any) => {
      console.log(res);
      res.token ? this.token = res.token : this.token = '';
    });
  }
}

