import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';

import { AppComponent } from './app.component';
import { HomecomponentComponent } from './homecomponent/homecomponent.component';
import { routing } from './app.routing';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { ProductService } from "app/product.service";
import { ProductListComponent } from './product-list/product-list.component';
import { OfferPipe } from './offer.pipe';
import { NoOfferPipe } from './no-offer.pipe';
import { LastSearchPipe } from './last-search.pipe';
import { ProductFilterPipe } from './product-filter.pipe';
import { AddUpdateComponent } from './add-update/add-update.component';

@NgModule({
  declarations: [
    AppComponent,
    HomecomponentComponent,
    UserComponent,
    AdminComponent,
    ProductListComponent,
    OfferPipe,
    NoOfferPipe,
    LastSearchPipe,
    ProductFilterPipe,
    AddUpdateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    routing,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
  ],
  providers: [
    ProductService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
