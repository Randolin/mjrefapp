import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Artist, Image, Tag } from '../model/model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseApiPort = environment.apiPort || 8080;
  private baseApiUri =
    window.location.protocol +
    '//' +
    window.location.hostname +
    ':' +
    this.baseApiPort +
    '/api/';
  private baseArtistsUri = this.baseApiUri + 'artists';
  private baseImagesUri = this.baseApiUri + 'images';
  private baseTagsUri = this.baseApiUri + 'tags';

  constructor(private http: HttpClient) {}

  getArtists(): Observable<Artist[]> {
    return this.http
      .get<Artist[]>(this.baseArtistsUri)
      .pipe(catchError(this.handleError<Artist[]>('getArtists', [])));
  }

  getImages(): Observable<Image[]> {
    return this.http
      .get<Image[]>(this.baseImagesUri)
      .pipe(catchError(this.handleError<Image[]>('getImages', [])));
  }

  getTags(): Observable<Tag[]> {
    return this.http
      .get<Tag[]>(this.baseTagsUri)
      .pipe(catchError(this.handleError<Tag[]>('getTags', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
