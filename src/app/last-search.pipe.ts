import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from 'app/iproduct';
import { LocalStorageService } from "angular-2-local-storage";

@Pipe({
  name: 'lastSearch'
})
export class LastSearchPipe implements PipeTransform {

  constructor(private localStorageService: LocalStorageService) { }

  transform(allProducts: IProduct[]) {
    return allProducts.filter((product: IProduct) => {
      let filterBy: any = this.localStorageService.get("lastSearchText");
      if (filterBy) {
        if (product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1) {
          return product;
        }
      }
    });
  }
}
