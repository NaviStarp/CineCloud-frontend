import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MediaUploaderComponent } from './media-uploader/media-uploader.component';
import { MediaFormComponent } from './media-form/media-form.component';
import { AuthGuard } from './services/auth.service';
export const routes: Routes = [
    { 
        path: '', 
        component: MediaUploaderComponent,
        canActivate: [AuthGuard], // Guard to check if user is authenticated
         
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignupComponent },
    { 
        path: 'subir/2', 
        component: MediaFormComponent,
        canActivate: [AuthGuard] // Guard to check if user is authenticated
    },
];
