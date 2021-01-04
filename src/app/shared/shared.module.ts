import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeOfficialService } from './time-official.service';
import { AlertService } from './alert.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [],
  providers: [
    TimeOfficialService,
    AlertService
  ]
})
export class SharedModule { }
