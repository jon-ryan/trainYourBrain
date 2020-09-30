import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { AdditemComponent } from './additem/additem.component';
import { AllitemsComponent } from './allitems/allitems.component';
import { AboutComponent } from './about/about.component';
import { SessionsComponent } from './sessions/sessions.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    data: {
      animation: 'home',
    },
  },
  {
    path: 'additem',
    component: AdditemComponent,
    data: {
      animation: 'add',
    },
  },
  {
    path: 'allitems',
    component: AllitemsComponent,
    data: {
      animation: 'all',
    },
  },
  {
    path: 'sessions',
    component: SessionsComponent,
    data: {
      animation: 'session',
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      animation: 'about',
    },
  },
  {
    path: 'edit',
    component: EditComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
