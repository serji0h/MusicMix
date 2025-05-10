import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./portfolio/portfolio.page').then( m => m.PortfolioPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage)
  }
];
