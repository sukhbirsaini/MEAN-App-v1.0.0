import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from 'app/iproduct';

@Pipe({
  name: 'noOffer'
})
export class NoOfferPipe implements PipeTransform {
transform(allProducts: IProduct[]) {
    return allProducts.filter(product => product.isOffer == false);
  }
}
