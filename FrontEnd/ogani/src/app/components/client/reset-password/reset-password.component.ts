import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Lấy token từ URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu và xác nhận mật khẩu không khớp!';
      return;
    }

    // Gửi yêu cầu đặt lại mật khẩu
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Mật khẩu của bạn đã được thay đổi thành công!';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại.';
        this.successMessage = '';
      }
    });
  }
}
