import { Routes } from '@angular/router';
import { ListComponent } from './users/list/list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
export const routes: Routes = [
    { path: 'user/list', component: ListComponent },
    { path: 'user/create', component: UserFormComponent},
    { path: '', redirectTo: 'user/list', pathMatch: 'full' },
    { path: 'user/update/:id', component: UserFormComponent },
    { path: '**', component:UserFormComponent}
];
