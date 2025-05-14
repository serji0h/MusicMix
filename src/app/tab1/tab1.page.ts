import { CommonModule } from '@angular/common';
import { MusicService } from './../services/music.service';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel,IonThumbnail } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonSearchbar, CommonModule,IonThumbnail],
})
export class Tab1Page {
  songs: string[] = [];
  search: string = '';
  songsSearched: string[] = [];
  isMobile: boolean = Capacitor.isNativePlatform();

  constructor(private MusicService:MusicService) {}

  async ngOnInit() {
    this.songs = await this.MusicService.listSongs();
    this.songsSearched = [...this.songs];//hace una copia exacta
  }

  searchSongs(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.songsSearched = this.songs.filter((cancion) =>
      cancion.toLowerCase().includes(searchTerm)
    );
  }

  directorySelected(event: any) {
    const files = Array.from(event.target.files) as File[];//convierte a array directamente
    const audioFiles = Array.from(files).filter((file:File) =>
    file.type.startsWith('audio/')
    );
    this.songs = audioFiles.map(file => file.name);
    this.songsSearched = [...this.songs];
  }
}
