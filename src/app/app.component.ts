import { Component, OnInit, ViewChild } from '@angular/core';
import { TimeOfficialService } from '../app/shared/time-official.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  items: any = [];
  info: any = {};
  work_sdate: any;
  work_edate: any;

  constructor(
    private timeOfficialService: TimeOfficialService,
  ) {
    this.work_sdate = moment(Date()).tz('Asia/Bangkok').format('YYYY-MM-DD');
    this.work_edate = moment(Date()).tz('Asia/Bangkok').format('YYYY-MM-DD');
  }

  ngOnInit() {
    this.getInfo();
  }


  async getInfo() {
    try {
      const rs: any = await this.timeOfficialService.select_date(this.work_sdate, this.work_edate);
      if (rs.info) {
        this.items = rs.info;
        console.log(this.items);
      } else {
        // this.alertService.error('เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.log(error);
      // this.alertService.error();
    }
  }
}
