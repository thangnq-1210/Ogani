import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AskAiService {
  constructor(private http: HttpClient) {}

  askAI(question: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/ai/ask', { question });
  }
}
