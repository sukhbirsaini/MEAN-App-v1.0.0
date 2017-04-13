import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from 'app/iproduct';
import { LocalStorageService } from "angular-2-local-storage";


@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  constructor(private localStorageService: LocalStorageService) { }

  transform(value: IProduct[], filterBy: string): IProduct[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return value.filter((product: IProduct) => {
      if (product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1) {
        this.localStorageService.set("lastSearchText", filterBy);
        return product;
      }
    }
    );
  }
}