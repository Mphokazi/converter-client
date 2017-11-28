import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Http } from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  fromCtrl: FormControl;
  toCtrl: FormControl;
  fromInput: FormControl;
  filteredFrom: Observable<any[]>;
  filteredTo: Observable<any[]>;
  answer: any;
  toMetrics: any[]  = [];

  fromMetrics: any[] = [
    { name: 'CELCIOUS'},
    { name: 'FARENHEIT'},
    { name: 'METERS'},
    { name: 'KILOMETERS'},
    { name: 'CENTIMETERS'},
    { name: 'KILOGRAMS'},
    { name: 'GRAMS'}
  ];

  distanceMetrics: any[] = [
    { name: 'METERS'},
    { name: 'KILOMETERS'},
    { name: 'CENTIMETERS'}
  ];

  temperatureMetrics: any[] =  [
    { name: 'CELCIOUS'},
    { name: 'FARENHEIT'}
    
  ];

  weightMetric: any = [
    { name: 'KILOGRAMS'},
    { name: 'GRAMS'}
  ]

  constructor(private http: Http){}

  filteretrics(name: string) {
    return this.fromMetrics.filter(metric =>
      metric.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  onSelectFrom(metric){
    this.filterTo(metric);
    console.log(this.filteredTo)
  }

  ngOnInit(){
    this.fromInput = new FormControl();
    this.fromCtrl = new FormControl();
    this.toCtrl = new FormControl();
    this.filteredFrom = this.onChange(this.fromCtrl, this.fromMetrics);

  }

  filterTo(metric){

    switch(metric.name){
      case 'CELCIOUS':
        this.toMetrics = [(this.stringify({name: 'FARENHEIT'}))];
      break;
      case 'FARENHEIT':
        this.toMetrics = [(this.stringify({name: 'FARENHEIT'}))];
      break;
      case 'GRAMS':
        this.toMetrics = [(this.stringify({name: 'KILOGRAMS'}))];
      break;
      case 'KILOGRAMS':
        this.toMetrics = [(this.stringify({name: 'GRAMS'}))];
      break;

      default:
        this.toMetrics = this.distanceMetrics;
        this.filteredTo = this.onChange(this.toCtrl, this.toMetrics)
      break;

    }
  }

  stringify(metric){
    let str = JSON.stringify(Array.of(metric));
    this.toMetrics = JSON.parse(str);
    this.filteredTo = this.onChange(this.toCtrl, this.toMetrics)
  }

  onChange(formCtrl: FormControl, metrics: any[]){
    return formCtrl.valueChanges
    .startWith(null)
    .map(metric => metric ? this.filteretrics(metric) : metrics.slice());
  }

  convert(){
    return this.http.get("http://localhost:8080/api/convert?input="+this.fromInput.value+"&unitName="+this.toCtrl.value)
    .map(mapper => mapper.json())
    .subscribe(subscriber => {
      console.log("Conveted value: "+ subscriber.content)
      this.answer = subscriber.content;
    });
  }
}
