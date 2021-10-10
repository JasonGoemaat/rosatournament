import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { FirebaseAuthSampleComponent } from './sample/firebase-auth-sample/firebase-auth-sample.component';
import { SamplesComponent } from './sample/samples/samples.component';
import { TodosComponent } from './sample/todos/todos.component';
import { TestSecondRouteComponent } from './test-second-route/test-second-route.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'second', component: TestSecondRouteComponent },
  { path: 'samples', component: SamplesComponent, pathMatch: 'full' },
  // { path: 'samples/auth', component: FirebaseAuthSampleComponent },
  { path: 'samples/todos', component: TodosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
