import { Subscription } from 'rxjs';
import { CityWeather } from './../models/city-weather.model';
import { WeatherService } from './../shared/weather.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  cityWeather: CityWeather = new CityWeather();
  form: FormGroup;
  subscription: Subscription;
  @ViewChild('searchBtn') searchBtn: ElementRef;
  errorMode = false;

  constructor(private weatherService: WeatherService, private title: Title) {}

  ngOnInit() {
    this.title.setTitle('Weather Provider');
    this.form = new FormGroup({
      search: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)])
    });
    this.subscription = this.weatherService.getCityWeather().subscribe(
      data => {
        this.cityWeather = data;
        console.log(this.cityWeather);
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCitySearch() {
    if (this.form.valid) {
      (<HTMLInputElement>this.searchBtn.nativeElement).innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Search';
      (<HTMLInputElement>this.searchBtn.nativeElement).disabled = true;
      const cityName = this.form.controls.search.value;
      this.subscription = this.weatherService
        .getCityWeather(cityName)
        .subscribe(
          data => {
            this.cityWeather = data;
            this.errorMode = false;
          },
          err => {
            this.errorMode = true;
          }
        );

      (<HTMLInputElement>this.searchBtn.nativeElement).innerHTML =
        '<i class="fas fa-search-location"></i> Search';
      (<HTMLInputElement>this.searchBtn.nativeElement).disabled = false;
    } else {
      Swal.fire('Invalid city', 'Please fill city name!', 'warning');
    }
  }
}
