import { Component, OnInit } from '@angular/core';
import { ProductService } from "app/product.service";
import { IProduct } from 'app/iproduct';
import { LocalStorageService } from "angular-2-local-storage";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  imageWidth: number = 50;
  imageMargin: number = 2;
  listFilter: string;
  errorMessage: string;

  products: IProduct[];

  constructor(private _productService: ProductService, private localStorageService: LocalStorageService) {
    
  }

  addProduct(): void {

  }

  editProduct(event): void {
    var idOfSelectedProduct = event.target.id;
 
  }

  ngOnInit(): void {
    this._productService.getAllProducts()
      .subscribe(products => this.products = products,
      error => this.errorMessage = <any>error);
  }


}
