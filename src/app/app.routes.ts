import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MediaFormComponent } from './pages/media-form/media-form.component';
import { MediaListComponent } from './media-list/media-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MediaFilterComponent } from './pages/media-filter/media-filter.component';
import { authGuard } from './services/auth.guard';
import { adminGuard } from './services/admin.guard';
import { NotAuthorizedComponent } from './general/not-authorized/not-authorized.component';
import { MediaUploaderComponent } from './pages/media-uploader/media-uploader.component';
import { ServerConfigComponent } from './pages/server-config/server-config.component';
import { MediaGalleryComponent } from './pages/media-gallery/media-gallery.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { SerieDetailComponent } from './pages/serie-detail/serie-detail.component';
export const routes: Routes = [
    { 
        path: 'subir', 
        component: MediaUploaderComponent,
        canActivate: [adminGuard],
        data: { animation: 'default' }
    },
    { path: 'login', component: LoginComponent,data: { animation: 'default' }},
    { path: 'register', component: SignupComponent ,data: { animation: 'default' }},
    { 
        path: 'subir/2', 
        component: MediaFormComponent,
        canActivate: [adminGuard] ,
        data: { animation: 'default' }
    },
    { path: 'server/config', component: ServerConfigComponent ,data: { animation: 'default' }},
    { path: 'prueba', component: MediaListComponent, canActivate: [authGuard],data: { animation: 'default' } },
    { path: '', component: MediaGalleryComponent, canActivate: [authGuard],data: { animation: 'default' } },
    { 
        path: 'peliculas', 
        component: MediaFilterComponent, 
        canActivate: [authGuard],
        data: { type: 'movies',animation: 'default' } 
    },
    { 
        path: 'pelicula/:id', 
        component: MovieDetailComponent, 
        canActivate: [authGuard] ,
        data: { animation: 'default' }
    }, 
    { 
        path: 'series', 
        component: MediaFilterComponent, 
        canActivate: [authGuard],
        data: { type: 'series',animation: 'default' } 
    },
    { 
        path: 'serie/:id', 
        component: SerieDetailComponent, 
        canActivate: [authGuard] ,
        data: { animation: 'default' }
    },
    {path: 'not-authorized', component: NotAuthorizedComponent, data: { animation: 'default '}},
    { path: '**', component: NotFoundComponent } 
];
