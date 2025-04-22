import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import {faBars, faHeart, faRightFromBracket, faUser} from '@fortawesome/free-solid-svg-icons'
import {faShoppingBag} from '@fortawesome/free-solid-svg-icons'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/_service/auth.service';
import { CartService } from 'src/app/_service/cart.service';
import { CategoryService } from 'src/app/_service/category.service';
import { StorageService } from 'src/app/_service/storage.service';
import { WishlistService } from 'src/app/_service/wishlist.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [MessageService]

})
export class IndexComponent implements OnInit {

  listItemInCart: any[] = [];
  totalPrice = 0;
  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  userIcon = faUser;
  logoutIcon = faRightFromBracket;
  bars = faBars;

  showDepartment = false;



  loginForm : any = {
    username : null,
    password : null
  }

  registerForm : any = {
    username: null,
    email: null,
    password: null
  }

  isSuccessful = false;
  isSignUpFailed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];
  errorMessage = '';
  authModal : boolean = false;
  listCategoryEnabled : any;


  keyword: any;

  constructor(
    public cartService:CartService,
    public wishlistService: WishlistService,
    private authService: AuthService,
    private storageService: StorageService,
    private messageService:MessageService,
    private categoryService: CategoryService,
    private router: Router){

  }

  ngOnInit(): void {
    this.getCategoryEnbled();
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.wishlistService.loadWishList();
    this.cartService.loadCart();
  }

  showDepartmentClick(){
    this.showDepartment = !this.showDepartment;
  }

  getCategoryEnbled(){
    this.categoryService.getListCategoryEnabled().subscribe({
      next: res =>{
        this.listCategoryEnabled = res;
      },error: err =>{
        console.log(err);
      }
    })
  }

  removeFromCart(item:any){
    this.cartService.remove(item);
  }

  removeWishList(item: any){
    this.wishlistService.remove(item);
  }

  showAuthForm(){
    this.router.navigate(['/login']);
  }

  logout():void{
    this.authService.logout().subscribe({
      next:res =>{
        this.storageService.clean();
        this.isLoggedIn = false;
        this.authModal = false;
        this.showSuccess("Bạn đã đăng xuất!!");
      },error: err=>{
        this.showError(err.message);
      }
    })
  }

  showCategoryDropdown: boolean = false;

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
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
