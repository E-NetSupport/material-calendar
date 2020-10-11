import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { CalendarService } from '../service/calendar.service';
import * as pSBC from '../service/pSBC';
import { CalendarConfig } from '../service/models';
import { SharedFunctions } from '../service/shared-functions';

@Component({
  selector: 'calendar-panel',
  templateUrl: './calendar-panel.component.html',
  styleUrls: ['./calendar-panel.component.scss']
})
export class CalendarPanelComponent implements OnInit {

  private _config: CalendarConfig = {
    panelBgColor: '#00677f', // 00677f 006105
    autoTextColor: true,
    textColor: '#fff',
    useHolidays: false,
    holidayColor: 'rgb(253, 173, 0)',
    holidayTextColor: 'rgb(253, 173, 0)',
    displayYear: true,
    firstDayOfWeekMonday: true,
    todayColor: '#fff',
    panelWidth: '100%',
    calendarWeek: true,
    switches: false,
  };
  private _data = null;
  private _month = new Date().getUTCMonth();
  private _year: number = new Date().getFullYear()

  calendar = null
  today = new Date().setHours(0, 0, 0, 0)

  get config(): CalendarConfig {
    return this._config;
  }
  get dataSource(): any {
    return this._data;
  }
  get month(): number {
    return this._month;
  }
  get year(): number {
    return this._year;
  }

  @Input()
  set dataSource(data: any) {
    this._data = data;
    this.generateX()
  }
  @Input()
  set month(data: number) {
    this._month = data;
    this.monthOverrride = false
    this.generateX()
  }
  @Input()
  set config(data: CalendarConfig) {
    this._config = data;
    console.log(data)
    this.generateX()
  }
  @Input()
  set year(data: number) {
    this._year = data;
    this.generateX()
  }
  @Input() placeholderDay: boolean = false;

  isLoading = true
  monthOverrride = false

  // Styling
  @HostBinding("style.--panel-color")
  panelBgColor;
  @HostBinding("style.--panel-color-darker")
  panelBgColorDarker;
  @HostBinding("style.--panel-color-lighter")
  panelBgColorLighter;
  @HostBinding("style.--text-color")
  panelColor;
  @HostBinding("style.--panel-color-holiday")
  panelBgColorHoliday;
  @HostBinding("style.--text-color-holiday")
  panelColorHoliday;
  @HostBinding("style.--today-color")
  todayColor;
  panelWidth = '100%';

  @Output() public clickDate = new EventEmitter<Object>();
  
  onClick(event){
    this.clickDate.emit(event);
  }

  constructor(private calendarService: CalendarService,
    private sharedFunctions: SharedFunctions) { }

  ngOnInit() {
    this.isLoading = false
  }

  onMonthForward() {
    this.monthOverrride = true
    if (this.month >= 11 || this._month >= 11) {
      this._year = parseInt(this.year.toString(), 10) + 1
      this._month = 0
    } else {
      this._month = parseInt(this._month.toString(), 10) + 1
    }
    this.generateX()
  }

  onMonthBackward() {
    this.monthOverrride = true
    if (this.month <= 0 || this._month <= 0) {
      this._year = parseInt(this.year.toString(), 10) - 1
      this._month = 11
    } else {
      this._month = parseInt(this._month.toString(), 10) - 1
    }
    this.generateX()
  }

  setCssVars() {
    this.panelBgColor = this.config.panelBgColor;
    this.panelBgColorDarker = pSBC.pSBC(-0.4, this.panelBgColor);
    this.panelBgColorLighter = pSBC.pSBC(0.3, this.sharedFunctions.lightOrDarkTextColor(this.panelBgColor));
    this.panelBgColorHoliday = this.config.holidayColor;
    this.todayColor = this.config.todayColor;
    this.panelWidth = '100%';

    if (this.config.autoTextColor) {
      this.panelColor = this.sharedFunctions.lightOrDarkTextColor(this.panelBgColor);
      this.panelColorHoliday = this.sharedFunctions.lightOrDarkTextColor(this.config.holidayColor);
    } else {
      this.panelColor = this.config.textColor;
      this.panelColorHoliday = this.config.holidayTextColor;
    }

    if (this.config.panelWidth != '' || this.config.panelWidth != null || this.config.panelWidth != undefined) {
      this.panelWidth = this.config.panelWidth;
    } else {
      this.panelWidth = '100%';
    }
  }

  generateX() {
    this.setCssVars()
    const usedYear = this.monthOverrride ? this._year : this.year
    const usedMonth = this.monthOverrride ? this._month : this.month
    this.calendar = this.calendarService.generateMatrix('monthly', this.config.calendarWeek, null, usedYear, usedMonth, 0, 0)
  }

}