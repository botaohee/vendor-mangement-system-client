import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASEURL } from '../constants';
import { GenericHttpService} from '../generic-http.service';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericHttpService<Product> {

  constructor(public http: HttpClient) {
    super(http, `${BASEURL}api/products`);
  }
}
