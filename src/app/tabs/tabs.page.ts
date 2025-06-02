import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { square, musicalNotesOutline, listOutline, personOutline, discOutline } from 'ionicons/icons';
import { IonTabs,IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/angular/standalone";


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink, ],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private router: Router) {
    addIcons({ musicalNotesOutline, listOutline, personOutline, discOutline  });
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}
