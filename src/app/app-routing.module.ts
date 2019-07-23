import { RecorderComponent } from "./recorder/recorder.component";
import { FilesComponent } from "./files/files.component";
import {
  AngularFireAuthGuard,
  hasCustomClaim,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate
} from '@angular/fire/auth-guard';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './clients/list/list.component';
import { EditFormComponent } from './clients/edit-form/edit-form.component';

const redirectUnauthorizedToLogin = redirectUnauthorizedTo(["login"]);
const redirectLoggedInToHome = redirectLoggedInTo(['clients']);

const routes: Routes = [
  {
    path: 'clients',
    component: ListComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {path: 'save', component: EditFormComponent},
      {path: 'save/:id', component: EditFormComponent}
    ]
  },
  {
    path: 'files',
    component: FilesComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'recorder',
    component: RecorderComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
