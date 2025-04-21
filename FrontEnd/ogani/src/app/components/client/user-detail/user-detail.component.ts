import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/_service/storage.service';
import { UserService } from 'src/app/_service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  providers: [MessageService]
})
export class UserDetailComponent implements OnInit {

  username: any;
  user: any;
  changePassword: boolean = false;

  updateForm: any = {
    firstname: null,
    lastname: null,
    email: null,
    country: null,
    state: null,
    address: null,
    phone: null
  }

  changePasswordForm: any = {
    oldPassword: null,
    newPassword: null,
    confirmPassword: null
  }

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.username = this.storageService.getUser().username;
    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.username).subscribe({
      next: res => {
        this.user = res;
        this.updateForm.firstname = res.firstname;
        this.updateForm.lastname = res.lastname;
        this.updateForm.email = res.email;
        this.updateForm.country = res.country;
        this.updateForm.state = res.state;
        this.updateForm.address = res.address;
        this.updateForm.phone = res.phone;
      },
      error: err => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not fetch user details. Please try again.'
        });
      }
    });
  }

  updateProfile() {
    const { firstname, lastname, email, country, state, address, phone } = this.updateForm;
    
    this.userService.updateProfile(this.username, firstname, lastname, email, country, state, address, phone).subscribe({
      next: res => {
        this.getUser();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully!'
        });
      },
      error: err => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Failed to update profile. Please try again.'
        });
      }
    });
  }


  changePasswordFunc() {
    const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm;
    // console.log("New Password:", newPassword);  
    // console.log("Confirm Password:", confirmPassword);  
    if (!newPassword || !confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty Password Fields',
        detail: 'Please fill in both the new password and confirm password fields!'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Password Mismatch',
        detail: 'New password and confirm password do not match!'
      });
      return;
    }

    this.userService.changePassword(this.username, oldPassword, newPassword).subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Password Changed',
          detail: 'Your password has been changed successfully!'
        });
        this.changePassword = false;  
        this.changePasswordForm = { oldPassword: null, newPassword: null, confirmPassword: null }; 
      },
      error: err => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Change Password Failed',
          detail: 'Incorrect password!'
        });
      }
    });
  }

  showChangePassword() {
    this.changePassword = true;
  }
}

