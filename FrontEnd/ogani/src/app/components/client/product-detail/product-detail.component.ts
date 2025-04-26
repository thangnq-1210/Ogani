import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faBars, faHeart, faPhone, faRetweet, faShoppingBag, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/_service/cart.service';
import { ProductService } from 'src/app/_service/product.service';
import { WishlistService } from 'src/app/_service/wishlist.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [MessageService]

})
export class ProductDetailComponent implements OnInit {
  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  bars = faBars;
  star = faStar;
  star_half = faStarHalf;
  retweet = faRetweet;
  isOutOfStock: boolean = false;


  showDepartment = false;

  id: number = 0;
  product : any;
  listRelatedProduct: any[] =[];
  quantity : number = 1;

  constructor(private productService: ProductService,private router: Router,private route: ActivatedRoute,public cartService: CartService,public wishlistService: WishlistService,private messageService: MessageService){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getProduct();
  }

  showDepartmentClick(){
    this.showDepartment = !this.showDepartment;
  }


  getProduct() {
    this.productService.getProduct(this.
      id).subscribe({
      next: res => {
        this.product = res;
        this.isOutOfStock = this.product.quantity === 0;
        if(this.product.quantity === 0) {
          this.quantity = 0;
        }
        this.getListRelatedProduct();
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

  

  getListRelatedProduct(){
    this.productService.getListRelatedProduct(this.product.category.id).subscribe({
      next: res =>{
        this.listRelatedProduct= res;
      },error: err=>{
        console.log(err);
      }
    })
  }

  addToCart(item: any){
    this.productService.getProduct(item.id).subscribe({
      next: res => {
        this.product = res;
        const productInCart = this.cartService.items.find((p: any) => p.id === res.id);
        const quantityInCart = productInCart ? productInCart.quantity : 0;
  
        if (res.quantity === 0) {
          this.showWarn("Out of Stock!");
          return;
        }
  
        if (quantityInCart >= res.quantity) {
          this.showWarn("Maximum products added in stock!");
          return;
        }
  
        this.cartService.getItems();
        this.cartService.addToCart(res, 1);
        this.showSuccess("Add To Cart Successfully!");
      },
      error: err => {
        console.log(err);
      }
    });
  }

  addCart(item: any) {
    this.productService.getProduct(item.id).subscribe({
      next: res => {
        this.product = res;
        const productInCart = this.cartService.items.find((p: any) => p.id === res.id);
        const quantityInCart = productInCart ? productInCart.quantity : 0;
        console.log(productInCart, quantityInCart);
        if (quantityInCart + this.quantity > res.quantity) {
          this.showWarn("Maximum products added in stock!");
          return;
        } 
        this.cartService.getItems();
        this.cartService.addToCart(item, this.quantity);
        this.showSuccess("Add To Cart Successfully!");
      },
      error: err => {
        console.log(err);
      }
    });
  }
  
  
  addToWishList(item: any){
    if(!this.wishlistService.productInWishList(item)){
      this.wishlistService.addToWishList(item);
      this.showSuccess("Add To Wishlist Successfully!")
    }
  }

  plusQuantity(){
    if(this.quantity < this.product.quantity){
    this.quantity += 1;
    }
  }
  subtractQuantity(){
    if(this.quantity > 1){
      this.quantity -= 1;
    }
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
