import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart, faRetweet, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/_service/cart.service';
import { CategoryService } from 'src/app/_service/category.service';
import { ProductService } from 'src/app/_service/product.service';
import { WishlistService } from 'src/app/_service/wishlist.service';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  providers: [MessageService]

})
export class ShopComponent implements OnInit {

  heart = faHeart;
  bag = faShoppingBag;
  retweet = faRetweet;

  id: number = 0;
  listProduct : any;
  product : any;
  listCategory : any;
  listProductNewest : any[] = [];

  rangeValues = [0,100];

  constructor(
    private categoryService:CategoryService,
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    public cartService:CartService,
    public wishlistService:WishlistService){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getListProductByCategory();
    this.getListCategoryEnabled();
    this.getNewestProduct();
    window.scrollTo(0, 0);
  }


  getListProductByCategory(){
    this.productService.getListByCategory(this.id).subscribe({
      next: res =>{
        this.listProduct = res;
      },error: err =>{
        console.log(err);
      }
    })
  }

  getListCategoryEnabled(){
    this.categoryService.getListCategoryEnabled().subscribe({
      next: res =>{
        this.listCategory = res;
      },error: err=>{
        console.log(err);
      }
    })
  }

  getNewestProduct(){
    this.productService.getListProductNewest(4).subscribe({
      next:res =>{
        this.listProductNewest = res;
      },error: err =>{
        console.log(err);
      }
    })
  }

  getListProductByPriceRange(){
    this.productService.getListByPriceRange(this.id,this.rangeValues[0],this.rangeValues[1]).subscribe({
      next: res =>{
        this.listProduct = res;
        console.log(this.listProduct);
      },error: err =>{
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

  addToWishList(item: any){
    if(!this.wishlistService.productInWishList(item)){
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
