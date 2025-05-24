import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicPlayerService } from '../services/music-player.service';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonRange, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.page.html',
  styleUrls: ['./music-player.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonRange, IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader],
})
export class MusicPlayerPage implements OnInit, OnDestroy {
  songName = '';
  songPath = '';
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  private interval: any;

  constructor(
    private route: ActivatedRoute,
    private player: MusicPlayerService
  ) {
    addIcons({ playOutline, pauseOutline, playSkipForwardOutline, playSkipBackOutline });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.songName = params['name'];
      this.songPath = params['path'];
      this.duration = parseFloat(params['duration']) || 0;
      console.log('Duration from params:', this.duration);
      await this.player.play(this.songPath);
      this.isPlaying = true;
      this.player.setDuration(this.duration);
      this.duration = await this.player.getDuration();
      if (this.duration === 0) {
        this.duration = 300; // Valor por defecto
        this.player.setDuration(this.duration);
      }
      console.log('Duration from service:', this.duration);
    });

    this.interval = setInterval(async () => {
      if (this.isPlaying) {
        this.currentTime = await this.player.getCurrentTime();
        console.log('Current time:', this.currentTime);
      }
    }, 500);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.player.stop();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.player.pause();
    } else {
      this.player.resume();
    }
    this.isPlaying = !this.isPlaying;
  }

  async onSeek(event: any) {
    const seekTime = event.detail.value;
    await this.player.seekTo(seekTime);
    this.currentTime = seekTime;
  }

  async skipBack() {
    const newTime = Math.max(0, this.currentTime - 10);
    await this.player.seekTo(newTime);
    this.currentTime = newTime;
  }

  async skipForward() {
    const newTime = Math.min(this.duration, this.currentTime + 10);
    await this.player.seekTo(newTime);
    this.currentTime = newTime;
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }
}
