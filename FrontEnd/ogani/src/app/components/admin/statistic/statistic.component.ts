import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from 'src/app/_service/category.service';
import { ImageService } from 'src/app/_service/image.service';
import { OrderService } from 'src/app/_service/order.service';
import { ProductService } from 'src/app/_service/product.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class StatisticComponent implements OnInit{
  
  listProduct: any;
  listCategory: any;
  listImage: any;
  listOrderDetail: any;

  disabled : boolean = true;
  constructor(private messageService: MessageService,private productService: ProductService,private imageService: ImageService,private categoryService:CategoryService, private orderService: OrderService){

  }

  ngOnInit(): void {
    this.getListProduct();
    this.getListCategoryEnabled();
    this.getListImage();
  }

  getListProduct(){
    this.productService.getListProduct().subscribe({
      next: res =>{
        this.listProduct =res;
        this.getListRevenue();
      },error: err=>{
        console.log(err);
      }
    })
  }

  getListCategoryEnabled(){
    this.categoryService.getListCategoryEnabled().subscribe({
      next: res =>{
        this.listCategory = res;
      },error : err=>{
        console.log(err);
      }
    })
  }

  getListImage(){
    this.imageService.getList().subscribe({
      next:res=>{
        this.listImage =res;
      },error: err=>{
        console.log(err);
      }
    })
  }

  getListRevenue(){
    this.orderService.getRevenueByProduct().subscribe({
        next: res =>{
          const revenueMap: { [key: number]: number } = {};
          res.forEach((od: any) => {
            const productId = od.product.id;
            if (!revenueMap[productId]) {
              revenueMap[productId] = 0;
            }
            revenueMap[productId] += od.subTotal;
          });
          this.listProduct.forEach((p: any) => {
            p.revenue = revenueMap[p.id] || 0;
          });
      },error: err=>{
        console.log(err);
      }
    })
  }
}
