import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/_service/storage.service';
import { UserService } from 'src/app/_service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.css'],
  providers: [MessageService]
})
export class AdminDetailComponent implements OnInit {
  
  username: any;
  user :any;

  changePassword : boolean = false;

  updateForm: any ={
    firstname: null,
    lastname: null,
    email: null,
    country: null,
    state:null,
    address: null,
    phone: null
  }

  changePasswordForm: any= {
    oldPassword : null,
    newPassword: null
  }

  constructor(private storageService: StorageService,private userService: UserService,private messageService: MessageService){}

  ngOnInit(): void {
    this.username = this.storageService.getUser().username;
    // console.log(this.storageService.getUser())
    this.getUser();
  }

  getUser(){
    this.userService.getUser(this.username).subscribe({
      next: res=>{
        this.user = res;
        this.updateForm.firstname = res.firstname;
        this.updateForm.lastname = res.lastname;
        this.updateForm.email = res.email;
        this.updateForm.country = res.country;
        this.updateForm.state = res.state;
        this.updateForm.address = res.address;
        this.updateForm.phone = res.phone;
      },error : err =>{
        console.log(err);
      }
    })
  }


  updateProfile(){
    const{firstname,lastname,email,country,state,address,phone} = this.updateForm;
    this.userService.updateProfile(this.username,firstname,lastname,email,country,state,address,phone).subscribe({
      next: res =>{
        this.getUser();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully!'
        });
      },error: err=>{
        console.log(err);
      }
    })
  }

  changePasswordFunc(){
    const{oldPassword,newPassword} = this.changePasswordForm;
    this.userService.changePassword(this.username,oldPassword,newPassword).subscribe({
      next: res =>{
        this.getUser();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully!'
        });
      },error: err =>{
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Failed to update profile. Please try again.'
        });
      }
    }) 
  }


  showChangePassword(){
    this.changePassword =true;
  }
}
