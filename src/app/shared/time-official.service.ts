import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeOfficialService {
  httpOptions: any
  token: any;

  constructor(@Inject('API_URL') private apiUrl: string, private httpClient: HttpClient) {
    this.token = sessionStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }

  async info() {
    const _url = `${this.apiUrl}/workTime/info`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async select_date(work_sdate: any, work_edate: any) {
    const _url = `${this.apiUrl}/workTime/select_date?work_sdate=${work_sdate}&work_edate=${work_edate}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }


}
