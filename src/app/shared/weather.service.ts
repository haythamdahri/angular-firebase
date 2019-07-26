import { CityWeather } from "./../models/city-weather.model";
import { ConstantsService } from "./constants.service";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient, private constantsService: ConstantsService) { }

  getCityWeather(cityName = 'Casablanca') {
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${this.constantsService.WEATHER_API_KEY}`)
    .pipe(map((data) => {
      const cityWeather: CityWeather = new CityWeather();
      cityWeather.name = data['name'];
      cityWeather.date = data['dt'];
      cityWeather.pressure = data['main']['pressure'];
      cityWeather.humidity = data['main']['humidity'];
      cityWeather.temp = data['main']['temp'];
      cityWeather.tempMax = data['main']['temp_max'];
      cityWeather.tempMin = data['main']['temp_min'];
      cityWeather.country = data['sys']['country'];
      cityWeather.sunset = data['sys']['sunset'];
      cityWeather.sunrise = data['sys']['sunrise'];
      cityWeather.description = data['weather'][0]['description'];
      cityWeather.windDegree = data['wind']['deg'];
      cityWeather.windSpeed = data['wind']['speed'];
      cityWeather.lat = data['coord']['lat'];
      cityWeather.lon = data['coord']['lon'];
      return cityWeather;
    }));
  }
}
