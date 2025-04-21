import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payment';

  constructor(private http: HttpClient) {}

  createPayment(orderId: number, amount: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/create?orderId=${orderId}&amount=${amount}`,
      {}
    );
  }

  
  
}
