import { Component, OnInit } from '@angular/core';
import { ProductService } from "app/product.service";
import { IProduct } from 'app/iproduct';
import { LocalStorageService } from "angular-2-local-storage";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  imageWidth: number = 50;
  imageMargin: number = 2;
  showImage: boolean = false;
  listFilter: string;
  listFilterValue: string;
  errorMessage: string;

  products: IProduct[];

  constructor(private _productService: ProductService, private localStorageService: LocalStorageService) {

  }
  search(): void {
    this.listFilterValue = this.listFilter;
  }
  clear(): void {
    this.listFilterValue = this.listFilter = '';
  }

  toggleButton(event): void {
    var arr = [];
    var idOfSelectedProduct = event.target.id;
    let product: IProduct = this.products.find((product: IProduct) => product.productId == parseInt(idOfSelectedProduct));
    if (product) {
      product.inCart = !product.inCart;
    }
    var itemsFromLocalStorage = this.localStorageService.get("addedToCart");
    if (itemsFromLocalStorage != null) {
      arr = JSON.parse(JSON.stringify(itemsFromLocalStorage));
    }
    var index = arr.indexOf(idOfSelectedProduct);
    if (index === -1) {
      arr.push(idOfSelectedProduct);
    } else {
      arr.splice(index, 1);
    }
    this.localStorageService.set("addedToCart", arr);
  }

  ngOnInit(): void {
    this._productService.getProducts()
      .subscribe(products => this.products = products,
      error => this.errorMessage = <any>error);
  }
}
