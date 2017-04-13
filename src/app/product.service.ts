import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LocalStorageService } from "angular-2-local-storage";


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IProduct } from 'app/iproduct';

@Injectable()
export class ProductService {
    private _productUrl = 'src/api/products/products.json';

    constructor(private _http: Http, private localStorageService: LocalStorageService) { }

    getProducts(): Observable<IProduct[]> {
        return this._http.get(this._productUrl)
            .map((response: Response) => {
                let products = <IProduct[]>response.json();
                let productIdFromLocalStorage: any = this.localStorageService.get("addedToCart");
                if (productIdFromLocalStorage) {
                    products.map((product: IProduct) => {
                        productIdFromLocalStorage.forEach(element => {
                            if (element == product.productId) {
                                product.inCart = true;
                            }
                        });
                    });
                }
                return products.filter((products: IProduct) => products.available == true);
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getAllProducts(): Observable<IProduct[]> {
        return this._http.get(this._productUrl)
            .map((response: Response) => {
                let products = <IProduct[]>response.json();
                return products;
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProduct(id: number): Observable<IProduct> {
        return this.getAllProducts()
            .map((products: IProduct[]) => { let product: IProduct =  products.find(p => p.productId === id); console.log(product); return product; });
    }

    updateProduct(product: IProduct): void {
        this.getProducts()
            .map((products: IProduct[]) => {
                let productFromProducts = products.find(p => p.productId === product.productId);
                if (productFromProducts) {
                    productFromProducts = product;
                }
            });
    }

    // this.markThreadAsRead
    //   .map( (thread: Thread) => {
    //     return (messages: Message[]) => {
    //       return messages.map( (message: Message) => {
    //         // note that we're manipulating `message` directly here. Mutability
    //         // can be confusing and there are lots of reasons why you might want
    //         // to, say, copy the Message object or some other 'immutable' here
    //         if (message.thread.id === thread.id) {
    //           message.isRead = true;
    //         }
    //         return message;
    //       });
    //     };
    //   })
    //   .subscribe(this.updates);


    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
