import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  token: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
  
      if (this.token) {
        this.authService.verifyEmail(this.token).subscribe({
          next: () => {
            alert('Xác thực email thành công!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            alert('Xác thực thất bại: ' + (err.error.message));
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
  

}
