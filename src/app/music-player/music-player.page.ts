import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonRange, IonButton, IonButtons, IonToolbar, IonBackButton, IonTitle, IonContent, IonIcon } from "@ionic/angular/standalone";
import { add, pauseOutline, playOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  standalone: true,
  selector: 'app-music-player',
  templateUrl: './music-player.page.html',
  styleUrls: ['./music-player.page.scss'],
  imports: [IonIcon, IonContent, IonTitle, IonHeader, IonRange, IonButton, IonButtons, IonToolbar, IonBackButton, CommonModule, FormsModule],
})
export class MusicPlayerPage {
  songName: string = '';
  songPath: string = '';
  audio: HTMLAudioElement | null = null;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;

  constructor(private route: ActivatedRoute) {
    addIcons({ playOutline, pauseOutline })
  }



  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.songName = params['name'];
      this.songPath = params['path'];
      this.loadSong();
    });
  }

  loadSong() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.audio = new Audio(this.songPath);
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio?.duration || 0;
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio?.currentTime || 0;
    });

    this.audio.play();
    this.isPlaying = true;
  }

  togglePlay() {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  seekTo(event: any) {
    if (this.audio) {
      this.audio.currentTime = event.detail.value;
    }
  }

  skipBack() {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
    }
  }

  skipForward() {
    if (this.audio) {
      this.audio.currentTime = Math.min(this.duration, this.audio.currentTime + 10);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  }
}
