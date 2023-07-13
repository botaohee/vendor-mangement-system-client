import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASEURL } from '../constants';
import { Report } from './report';
import { GenericHttpService} from '../generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends GenericHttpService<Report> {

  constructor(public http: HttpClient) {
    super(http, `${BASEURL}api/pos`);
  } // constructor
}
