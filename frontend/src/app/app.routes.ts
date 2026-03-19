import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginPage } from './features/login/login.page';
import { EmpleadoFormPage } from './features/empleados/empleado-form.page';
import { EmpleadosListPage } from './features/empleados/empleados-list.page';
import { DepartamentoFormPage } from './features/departamentos/departamento-form.page';
import { DepartamentosListPage } from './features/departamentos/departamentos-list.page';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
	{
		path: 'login',
		component: LoginPage
	},
	{
		path: '',
		component: ShellComponent,
		canActivate: [authGuard],
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'empleados'
			},
			{
				path: 'empleados',
				component: EmpleadosListPage
			},
			{
				path: 'empleados/nuevo',
				component: EmpleadoFormPage,
				canActivate: [roleGuard],
				data: { role: 'ADMIN' }
			},
			{
				path: 'empleados/:clave/editar',
				component: EmpleadoFormPage,
				canActivate: [roleGuard],
				data: { role: 'ADMIN' }
			},
			{
				path: 'departamentos',
				component: DepartamentosListPage
			},
			{
				path: 'departamentos/nuevo',
				component: DepartamentoFormPage,
				canActivate: [roleGuard],
				data: { role: 'ADMIN' }
			},
			{
				path: 'departamentos/:clave/editar',
				component: DepartamentoFormPage,
				canActivate: [roleGuard],
				data: { role: 'ADMIN' }
			}
		]
	},
	{
		path: '**',
		redirectTo: ''
	}
];
