import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Song {
  id?: number;
  name: string;
  path: string;
  duration?: number;
  title?: string;
  artist?: string;
  album?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/playlists';

  constructor(private http: HttpClient) {}

  createOrGetSong(title: string, artist: string, album: string): Observable<any> {
    const songRequest = { titulo: title, artista: artist, album: album };
    return this.http.post<any>(`${this.apiUrl}/songs`, songRequest);
  }


}
