import { Component, OnInit, AfterViewInit } from '@angular/core';
import { faBars, faHeart, faPhone, faRetweet, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/_service/cart.service';
import { ProductService } from 'src/app/_service/product.service';
import { WishlistService } from 'src/app/_service/wishlist.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]

})
export class HomeComponent implements OnInit, AfterViewInit {
  

  heart = faHeart;
  bag = faShoppingBag;
  retweet = faRetweet;

  listProductNewest : any;
  listProductPrice: any;
  product : any;

  showDepartment = true;
  isOutStock = false;


  category_items_response= [
  
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
  },
  {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
  },
  {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
  }
  
]


category_items = [
  {
    id: 13,
    src: 'assets/image/product/C_carrot.png',
    alt: '',
    title: 'Carrot'
  },
  {
    id: 12,
    src: 'assets/image/product/C_onion.png',
    alt: '',
    title: 'Onion'
  },
  {
    id: 14,
    src: 'assets/image/product/C_broccoli.png',
    alt: '',
    title: 'Broccoli'
  },
  {
    id: 18,
    src: 'assets/image/product/C_grape.png',
    alt: '',
    title: 'Grape'
  },
  {
    id: 17,
    src: 'assets/image/product/C_apple.png',
    alt: '',
    title: 'Apple'
  },
  {
    id: 3,
    src: 'assets/image/product/C_fruit.png',
    alt: '',
    title: 'Fresh Fruit'
  }

] ;

constructor(private productService:ProductService,private cartService: CartService, private wishlistService: WishlistService,private messageService: MessageService){}

ngOnInit(): void {
  this.getListProduct();  
  
}

ngAfterViewInit(): void {
  const carouselElement = document.querySelector('#carouselExampleFade');
  if (carouselElement) {
    new bootstrap.Carousel(carouselElement, {
      interval: 4000, 
      ride: 'carousel'
    });
  }
}

getListProduct(){
  this.productService.getListProductNewest(8).subscribe({
    next: res =>{
      this.listProductNewest = res;
    },error: err =>{
      console.log(err);
    }
  })
  this.productService.getListProductByPrice().subscribe({
    next:res =>{
      this.listProductPrice =res;
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

      if (quantityInCart >= res.quantity) {
        this.showWarn("Maximum products added in stock!");
      } else {
        this.cartService.getItems();
        this.cartService.addToCart(res, 1);
        this.showSuccess("Add To Cart Successfully!");
      }
    },
    error: err => {
      console.log(err);
    }
  });
}

addToWishList(item: any){
  if(!this.wishlistService.productInWishList(item)){
    this.showSuccess("Add To Wishlist Successfully!")
    this.wishlistService.addToWishList(item);
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
