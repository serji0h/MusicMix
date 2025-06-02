import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

@NgModule({
  declarations: [],
  imports: [
    TabsPage,
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TabsPage,
        children: [
          {
            path: 'tab1',
            loadComponent: () => import('../tab1/tab1.page').then(m => m.Tab1Page),
          },
          {
            path: 'tab2',
            loadComponent: () => import('../tab2/tab2.page').then(m => m.Tab2Page),
          },
          {
            path: 'tab3',
            loadComponent: () => import('../tab3/tab3.page').then(m => m.Tab3Page),
          },
          {
            path: '',
            redirectTo: 'tab1',
            pathMatch: 'full',
          },
        ],
      }
    ])
  ]
})
export class TabsPageModule {}
