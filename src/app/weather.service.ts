import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {ICurrentWeather} from './interfaces';
import {map} from 'rxjs/operators';

interface ICurrentWeatherData {
  weather: [{
    description: string,
    icon: string
  }];
  main: {
    temp: number
  };
  sys: {
    country: string
  };
  name: string;
  dt: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private httpClient: HttpClient) { }

  private static convertKelvinToFahrenheit(kelvin: number): number {
    return kelvin - 273.15;
  }

  private static transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: WeatherService.convertKelvinToFahrenheit(data.main.temp),
      description: data.weather[0].description
    };
  }
  getCurrentWeather(city: string, country: string): Observable<ICurrentWeather> {
    return this.httpClient.get<ICurrentWeatherData>(
      `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?` +
      `q=${city},${country}&appid=${environment.appiKey}`)
      .pipe(map(data => WeatherService.transformToICurrentWeather(data)));
  }
}
