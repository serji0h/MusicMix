import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Capacitor } from '@capacitor/core';

export interface Song {
  id?: number;
  nombre: string;
  path: string;
  duration?: number;
  title?: string;
  artist?: string;
  album?: string;
}

export interface Playlist {
  id?: number;
  nombre: string;
  imagen: string;
  canciones: Song[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  setDirectorySongs(songsSearched: Song[]) {
    this.songsSearched= songsSearched;

  }
  private apiUrl = 'https://musicmixback.onrender.com/api/playlists';
  private apiUrlWeb = 'https://musicmixback.onrender.com/api/playlists'
  private userId: number | null = null;
  public songsSearched: Song[] = [];
  constructor(private http: HttpClient){}

  //solo crea la cancion
  createOrGetSong(title: string, artist: string, album: string): Observable<any> {
    //comprueba si es web o movil
    if(Capacitor.getPlatform() == 'web') {
      return this.http.post<any>(`${this.apiUrlWeb}/songs`, { titulo: title, artista: artist, album: album });
    }else{
      const songRequest = { titulo: title, artista: artist, album: album };
      this.http.post(`${this.apiUrl}/songs`, songRequest).subscribe({
        next: (response) => console.log('Éxito:', response),
        error: (error) => console.error('Error detallado:', error)
      });
      return this.http.post<any>(`${this.apiUrl}/songs`, songRequest);

    }

  }

  setUserId(userId: number) {
    this.userId = userId;
  }

  getUserId(): number | null {
    return this.userId;
  }

// obtiene listas de reproduccion
getPlaylists(): Observable<Playlist[]> {
  if (!this.userId) {
    throw new Error('Usuario no autenticado');
  }
  if(Capacitor.getPlatform() == 'web') {
    return this.http.get<Playlist[]>(`${this.apiUrlWeb}/user/${this.userId}`);
  }else{
    return this.http.get<Playlist[]>(`${this.apiUrl}/user/${this.userId}`);

  }
}

//crea lista de reproduccion
createPlaylist(nombre: string): Observable<Playlist> {
  if (!this.userId) {
    throw new Error('Usuario no autenticado');
  }
  return this.http.post<Playlist>(`${this.apiUrl}/user/${this.userId}`, nombre);
}

//añade canciones a la lista
addSongToPlaylist(playlistId: number | undefined, songId: number): Observable<Playlist> {
  return this.http.post<Playlist>(`${this.apiUrl}/${playlistId}/add-song/${songId}`, {});
}

//obtiene las canciones de una play list
getSongsFromPlaylist(playlistId: number): Observable<Song[]> {
  return this.http.get<Song[]>(`${this.apiUrl}/${playlistId}/songs`);

  }
//otiene una cancion por el id
  getSongById(songId: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/songs/${songId}`);
  }

  removeSongFromPlaylist(playlistId: number, songId: number): Observable<Playlist> {
    return this.http.delete<Playlist>(`${this.apiUrl}/${playlistId}/remove-song/${songId}`);
  }

}
