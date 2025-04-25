import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/_service/auth.service';
import { StorageService } from 'src/app/_service/storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  providers: [MessageService]

})
export class LoginPageComponent implements OnInit {


  isSuccessful = false;
  isSignUpFailed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];
  errorMessage = '';

  loginForm : any = {
    username : null,
    password : null
  }

  registerForm : any = {
    username: null,
    email: null,
    password: null
  }

  forgotEmail: string = '';
  isForgotPassword: boolean = false;
  forgotMessage: string = '';
  forgotError: string = '';
  isLoading: boolean = false;
  toggleForgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
    if (!this.isForgotPassword) {
      this.forgotEmail = '';
      this.forgotMessage = '';
      this.forgotError = '';
    }
  }

  constructor(private authService:AuthService,private storageService: StorageService,private messageService:MessageService,private router:Router){}

  ngOnInit(): void {
  }

  login():void{
    const {email,password} = this.loginForm;
    console.log(this.loginForm);
    this.authService.login(email,password).subscribe({
      next: res =>{
        this.storageService.saveUser(res);
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        this.roles = this.storageService.getUser().roles;
        this.showSuccess("Đăng nhập thành công!!");
        this.router.navigate(['/']);
      },error: err =>{
        console.log(err);
        this.showError("Đăng nhập thất bại!!Vui lòng kiểm tra lại thông tin đăng nhập của bạn!!");
        this.isLoggedIn = false;
        this.isLoginFailed = true;
      }
    })
  }

  register():void{
    this.isLoading = true;
    const {username,email,password} = this.registerForm;
    console.log(this.registerForm);
    this.authService.register(username,email,password).subscribe({
      next: res =>{
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Signup Success',
          detail: 'Đăng ký thành công, Đương link xác thực đã được gửi đến gmail!'
        });
        this.isLoading = false;
      },error: err =>{
        this.messageService.add({
          severity: 'error',
          summary: 'Signup Failed',
          detail: 'Đăng ký thất bại!',
        });
        this.isSignUpFailed = true;
        this.isLoading = false;
      }
    })
  }

  loginFormChange(){
    document.getElementById('container')?.classList.remove("right-panel-active");
  }
  registerFormChange(){
    document.getElementById('container')?.classList.add("right-panel-active");
  }

  onResetPassword() {
    this.isLoading = true;
    this.authService.forgotPassword(this.forgotEmail).subscribe({
      next: () => {
        this.forgotMessage = '✅Email khôi phục đã được gửi!';
        this.forgotError = '';
        this.isLoading = false;
      },
      error: () => {
        this.forgotError = '❌Email chưa đăng ký hoặc sai định dạng!.';
        this.isLoading = false;
      }
    });
  }  

  showSuccess(text: string) {
    this.messageService.add({severity:'success', summary: 'Success', detail: text});
  }
  showError(text: string) {
    this.messageService.add({severity:'error', summary: 'Error', detail: text});
  }

  showWarn(text: string) {
    this.messageService.add({severity:'warn', summary: 'Warn', detail: text});
  }

}
