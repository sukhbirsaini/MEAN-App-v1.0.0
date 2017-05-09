import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from "app/product.service";
import { Subscription } from 'rxjs/Subscription';
import { IProduct } from "app/iproduct";

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.css']
})
export class AddUpdateComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  product: IProduct;
  errorMessage: string;
  isEditMode: boolean = true;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService) { }

  ngOnInit(): void {
    this.product = <IProduct>{
      isOffer: true,
      available: true,
      imageUrl: "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png",
      inCart: false,
    };
    this.sub = this._route.params.subscribe(
      params => {
        let id = +params['id'];
        if (isNaN(id)) {
          this.isEditMode = false;
        } else {
          this.getProduct(id);
        }
      });
  }

  getProduct(id: number) {
    this._productService.getProduct(id).subscribe(
      product => { debugger; this.product = product; },
      error => this.errorMessage = <any>error);
  }

  onSubmit(product1: IProduct): void {
    debugger;
    var a = product1;
    if (this.isEditMode) {
      this._productService.updateProduct(this.product).subscribe(
        product => {
          this.product = product;
          alert("Product Updated!");
          this.onBack();
        },
        error => this.errorMessage = <any>error);
    } else {
      this._productService.addProduct(this.product).subscribe(
        product => product => {
          this.product = product;
          alert("Product Added!");
          this.onBack();
        },
        error => this.errorMessage = <any>error);
    }
  }


  onBack(): void {
    this._router.navigate(['/admin']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
