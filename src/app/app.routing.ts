import { Routes, RouterModule } from '@angular/router';
import { HomecomponentComponent } from './homecomponent/homecomponent.component';
import { UserComponent } from "app/user/user.component";
import { AdminComponent } from "app/admin/admin.component";
import { AddUpdateComponent } from "app/add-update/add-update.component";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: HomecomponentComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'product/:id',
    component: AddUpdateComponent
  },
  {
    path: 'product',
    component: AddUpdateComponent
  }
];

export const routing = RouterModule.forRoot(appRoutes);
