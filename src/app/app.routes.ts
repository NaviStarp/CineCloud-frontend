import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MediaUploaderComponent } from './media-uploader/media-uploader.component';
import { MediaFormComponent } from './media-form/media-form.component';
import { AuthGuard } from './services/auth.service';
import { ServerConfigComponent } from './server-config/server-config.component';
import { MediaListComponent } from './media-list/media-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MediaGalleryComponent } from './media-gallery/media-gallery.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { SerieDetailComponent } from './serie-detail/serie-detail.component';
import { MediaFilterComponent } from './media-filter/media-filter.component';
export const routes: Routes = [
    { 
        path: '', 
        component: MediaUploaderComponent,
        canActivate: [AuthGuard],
        data: { animation: 'default' }
    },
    { path: 'login', component: LoginComponent,data: { animation: 'default' }},
    { path: 'register', component: SignupComponent ,data: { animation: 'default' }},
    { 
        path: 'subir/2', 
        component: MediaFormComponent,
        canActivate: [AuthGuard] ,
        data: { animation: 'default' }
    },
    { path: 'server/config', component: ServerConfigComponent ,data: { animation: 'default' }},
    { path: 'prueba', component: MediaListComponent, canActivate: [AuthGuard],data: { animation: 'default' } },
    { path: 'lista', component: MediaGalleryComponent, canActivate: [AuthGuard],data: { animation: 'default' } },
    { 
        path: 'peliculas', 
        component: MediaFilterComponent, 
        canActivate: [AuthGuard],
        data: { type: 'movies',animation: 'default' } 
    },
    { 
        path: 'pelicula/:id', 
        component: MovieDetailComponent, 
        canActivate: [AuthGuard] ,
        data: { animation: 'default' }
    }, 
    { 
        path: 'series', 
        component: MediaFilterComponent, 
        canActivate: [AuthGuard],
        data: { type: 'series',animation: 'default' } 
    },
    { 
        path: 'serie/:id', 
        component: SerieDetailComponent, 
        canActivate: [AuthGuard] ,
        data: { animation: 'default' }
    },
    { path: '**', component: NotFoundComponent } 
];
