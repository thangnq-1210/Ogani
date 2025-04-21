import { Component } from '@angular/core';
import { faBars, faHeart, faPhone, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/_service/cart.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [MessageService]
})
export class CartComponent {

  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  bars = faBars;

  showDepartment = false;

  discountCode: string = '';
  discountPercent: number = 0;

  constructor(
    public cartService: CartService,
    private messageService: MessageService,
  ){

  }

  showDepartmentClick(){
    this.showDepartment = !this.showDepartment;
  }


  removeFromCart(item:any){
    this.cartService.remove(item);
  }

  updateQuantity(item: any,event: any){
    let quantity : number = event.target.value;
    this.cartService.updateCart(item,quantity);
  }

  plusQuantity(item:any){
    let quantity = Number(item.quantity);
    this.cartService.updateCart(item,quantity+=1);
  } 
  subtractQuantity(item: any){
    if(item.quantity > 1){
      let quantity = Number(item.quantity);
      this.cartService.updateCart(item,quantity-=1);
    }
  }

  applyDiscount() {
    const code = this.discountCode.trim().toUpperCase();

    const validCodes: { [key: string]: number } = {
      'NGUYENQUYTHANG10': 10,
      'NGUYENQUYTHANG20': 20,
      'NGUYENQUYTHANG30': 30
    };

    if (validCodes[code]) {
      this.discountPercent = validCodes[code];
      this.cartService.discountPercent = this.discountPercent;
      this.messageService.add({
        severity: 'success',
        summary: 'Valid code',
        detail: `Discount applied ${this.discountPercent}%`
      });
    } else {
      this.discountPercent = 0;
      this.cartService.discountPercent = 0;  
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid code',
        detail: 'Please try again with another code!'
      });
    }
  }

  get discountedTotal(): number {
    const discountAmount = (this.cartService.total * this.discountPercent) / 100;
    return this.cartService.total - discountAmount;
  }
  



}
