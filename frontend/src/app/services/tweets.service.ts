import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TweetsService {

  constructor(private http: HttpClient) { }

  getTweets():Observable<any[]>{
   return this.http.get<any[]>('http://localhost:9000')
  }
}
