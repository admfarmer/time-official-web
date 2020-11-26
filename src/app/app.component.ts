import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { TimeOfficialService } from '../app/shared/time-official.service';
import * as moment from 'moment-timezone';
import * as mqttClient from '../vendor/mqtt';
import { MqttClient } from 'mqtt';
import { CountdownComponent } from 'ngx-countdown';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild(CountdownComponent) counter: CountdownComponent;

  items: any = [];
  info: any = {};
  work_sdate: any;
  work_edate: any;

  client: MqttClient;
  notifyUrl: string;
  notifyUser = null;
  notifyPassword = null;

  isOffline = false;

  constructor(
    private timeOfficialService: TimeOfficialService,
    private zone: NgZone,
  ) {
    this.notifyUrl = `ws://203.113.117.66:8080`;
    this.notifyUser = `q4u`;
    this.notifyPassword = `##q4u##`;

    this.work_sdate = moment(Date()).tz('Asia/Bangkok').format('YYYY-MM-DD');
    this.work_edate = moment(Date()).tz('Asia/Bangkok').format('YYYY-MM-DD');
  }

  ngOnInit() {
    this.getInfo();
    this.connectWebSocket();
  }

  public unsafePublish(topic: string, message: string): void {
    try {
      this.client.end(true);
    } catch (error) {
      console.log(error);
    }
  }

  public ngOnDestroy() {
    try {
      this.client.end(true);
    } catch (error) {
      console.log(error);
    }
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

  connectWebSocket() {

    try {
      this.client.end(true);
    } catch (error) {
      // console.log(error);
    }
    // const rnd = new Random();
    // const username = sessionStorage.getItem('username');
    const strRnd = moment(Date()).format('YYYYMMDDHHmmss');
    // rnd.integer(1111111111, 9999999999);
    const clientId = `timeofficial-center-${strRnd}`;

    // console.log(clientId);
    // console.log('***!!!***');

    try {
      this.client = mqttClient.connect(this.notifyUrl, {
        clientId: clientId,
        username: this.notifyUser,
        password: this.notifyPassword
      });
    } catch (error) {
      // console.log(error);
    }

    const topic = `timeofficial`;
    const that = this;

    this.client.on('message', (topic, payload) => {
      console.log('topic: ' + topic + ' payload: ' + payload)
      let JsonPayload = JSON.parse(payload.toString());
      console.log(JsonPayload);
      this.getInfo();

    });

    this.client.on('connect', () => {
      console.log('Connected!');
      that.zone.run(() => {
        that.isOffline = false;
      });

      that.client.subscribe(topic, (error) => {
        if (error) {
          that.zone.run(() => {
            that.isOffline = true;
            try {
              that.counter.restart();
            } catch (error) {
              // console.log(error);
            }
          });
        }
      });
    });

    this.client.on('close', () => {
      console.log('MQTT Conection Close');
    });

    this.client.on('error', (error) => {
      console.log('MQTT Error');
      that.zone.run(() => {
        that.isOffline = true;
        that.counter.restart();
      });
    });

    this.client.on('offline', () => {
      console.log('MQTT Offline');
      that.zone.run(() => {
        that.isOffline = true;
        try {
          that.counter.restart();
        } catch (error) {
          // console.log(error);
        }
      });
    });
  }


  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'timeofficial-export.xlsx');

  }

}
