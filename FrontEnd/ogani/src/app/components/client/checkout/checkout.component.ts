
import { Component, OnInit } from '@angular/core';
import { faBars, faHeart, faPhone, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/_class/order';
import { OrderDetail } from 'src/app/_class/order-detail';

import { CartService } from 'src/app/_service/cart.service';
import { OrderService } from 'src/app/_service/order.service';
import { StorageService } from 'src/app/_service/storage.service';
import { PaymentService } from 'src/app/_service/payment.service';  
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [MessageService]
})
export class CheckoutComponent implements OnInit {
  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  bars = faBars;
  showDepartment = false;
  order = new Order();
  listOrderDetail: any[] = [];
  username!: string;

  orderForm: any = {
    firstname: null,
    lastname: null,
    country: null,
    address: null,  
    town: null,
    state: null,
    postCode: null,  
    email: null,
    phone: null,
    note: null,
    paymentMethod: null
  }

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private storageService: StorageService,
    private paymentService: PaymentService,  
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['status'] === 'success') {
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Payment successful',
            detail: 'Order successful!',
          });
          this.cartService.clearCart();
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 5000);
        }, 0); 
      }
    });
  }

  ngOnInit(): void {
    this.username = this.storageService.getUser().username;
    this.cartService.getItems();
    console.log(this.username);
  }

  showDepartmentClick() {
    this.showDepartment = !this.showDepartment;
  }

  validateForm(): boolean {
    const {
      firstname, lastname, country, address, town, state,
      postCode, email, phone, paymentMethod
    } = this.orderForm;
  
    if (!firstname || !lastname || !country || !address || !town || !state || !postCode || !email || !phone || !paymentMethod) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields!',
      });
      return false;
    }
    return true;
  }

  loading = false;

  placeOrder() {
    if (this.loading) return;
  
    if (!this.validateForm()) {
      return;
    }
  
    this.loading = true;
    this.listOrderDetail = [];
  
    this.cartService.items.forEach(res => {
      let orderDetail: OrderDetail = new OrderDetail();
      orderDetail.name = res.name;
      orderDetail.price = res.price;
      orderDetail.quantity = res.quantity;
      orderDetail.subTotal = res.subTotal;
      this.listOrderDetail.push(orderDetail);
    });
  
    const {
      firstname, lastname, country, address, town, state,
      postCode, phone, email, note, paymentMethod
    } = this.orderForm;


    const discountedTotal = this.cartService.discountedTotal; 
  
    this.orderService.placeOrder(
      firstname, lastname, country, address, town, state,
      postCode, phone, email, note, this.listOrderDetail, this.username, paymentMethod 
    ).subscribe({
      next: (res) => {
        const orderId = res.orderId;
  
        if (paymentMethod === 'VNPay') {
            this.paymentService.createPayment(orderId, discountedTotal).subscribe({
            next: (res) => {
              console.log("payment response = ", res);
              window.location.href = res.paymentUrl;
            },
            error: (err) => {
              console.log('Lỗi khi tạo thanh toán:', err);
              this.loading = false;
            }
          });
        } else {
          this.cartService.clearCart();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order successful!',
          });
          setTimeout(() => {
            this.router.navigate(['/']);
          },5000);
        }
      },
      error: (err) => {
        console.log('Lỗi khi đặt hàng:', err);
        this.loading = false;
      }
    });
  }

  
  
  
  
}

