import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { LocalStorageService } from "angular-2-local-storage";


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IProduct } from 'app/iproduct';

@Injectable()
export class ProductService {
    private _productUrl = 'https://inventorymanagementapp.herokuapp.com/api/';
    

    constructor(private _http: Http, private localStorageService: LocalStorageService) { }


    getProducts(): Observable<IProduct[]> {
        return this._http.get(this._productUrl + "getProducts")
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
        return this._http.get(this._productUrl + "getProducts")
            .map((response: Response) => {
                let products = <IProduct[]>response.json();
                return products;
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProduct(id: number): Observable<IProduct> {
        return this.getAllProducts()
            .map((products: IProduct[]) => { let product: IProduct = products.find(p => p.productId === id); return product; });
    }

    addProduct(product: IProduct): Observable<IProduct> {
        debugger;
        let options = new RequestOptions({
            headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
        });
        return this._http.put(this._productUrl + "saveProduct", JSON.stringify(product), options)
            .map((response: Response) => {
                debugger;
                let products = <IProduct[]>response.json();
                return products;
            })
            .catch(this.handleError);
    }

    // updateProduct(product: IProduct): Observable<IProduct> {
    //     let options = new RequestOptions({
    //         headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
    //     });
    //     return this._http.put(`${this._productUrl}`, JSON.stringify(product), options)
    //         .map((response: Response) => {
    //             let products = <IProduct[]>response.json();
    //             return products;
    //         })
    //         .do(data => console.log('All: ' + JSON.stringify(data)))
    //         .catch(this.handleError);
    // }

    updateProduct(product: IProduct): Observable<IProduct> {
        let options = new RequestOptions({
            headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
        });
        return this._http.put(this._productUrl + "updateProduct", JSON.stringify(product), options)
            .map((response: Response) => {
                let products = <IProduct[]>response.json();
                return products;
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
