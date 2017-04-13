import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from 'app/iproduct';

@Pipe({ name: 'offer' })
export class OfferPipe implements PipeTransform {
  transform(allProducts: IProduct[]) {
    return allProducts.filter(product => product.isOffer == true);
  }

}