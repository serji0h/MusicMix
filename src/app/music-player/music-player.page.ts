import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicPlayerService } from '../services/music-player.service';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonRange, IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline } from 'ionicons/icons';
@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.page.html',
  styleUrls: ['./music-player.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonRange, IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, /* tus imports standalone */]
})
export class MusicPlayerPage {
  songName = '';
  songPath = '';
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  constructor(
    private route: ActivatedRoute,
    private player: MusicPlayerService
  ) {
    addIcons({ playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline });

    }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.songName = params['name'];
      this.songPath = params['path'];
      await this.player.play(this.songPath);
      this.isPlaying = true;

      // solo para web: obtener duración
      setTimeout(async () => {
        this.duration = await this.player.getDuration();
      }, 1000);
    });

    // actualizar tiempo cada segundo (web)
    setInterval(async () => {
      if (this.isPlaying) {
        this.currentTime = await this.player.getCurrentTime();
      }
    }, 1000);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.player.pause();
    } else {
      this.player.resume();
    }
    this.isPlaying = !this.isPlaying;
  }

  seekTo(event: any) {
    this.player.seekTo(event.detail.value);
  }

  skipBack() {
    this.player.seekTo(Math.max(0, this.currentTime - 10));
  }

  skipForward() {
    this.player.seekTo(Math.min(this.duration, this.currentTime + 10));
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }
}
