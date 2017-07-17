import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import {getWeather, getCityFromZip} from '../../utils/api';
import priv from '../../private';
import './tablet.css';
import './desktop.css';
import './mobile.css';

const loadWeather = getWeather(axios, priv.WEATHER_KEY);
const loadCity = getCityFromZip(axios, priv.ZIP_KEY)

class Container extends Component {

  constructor() {
    super();
    this.state = {
      city: '',
      state: '',
      time: '',
      zip: '07307',
      weather: '',
      temp: '',
      high: '',
      low: '',
      pressure: '',
      visibility: '',
      rainfall: '',
      sunrise: '',
      sunset: '',
      celsius: false,
      humanTime: '',
      intervalId: ''
    }
  }

  componentWillMount() {
    this.getWeather('07307');
  }

  error(e) {
    console.log("error: ", e);
    const objKeys = Object.keys(this.state);
    const errorState = objKeys.reduce((memo, val) => {
      memo[val] = 'error loading data';
      return memo;
    }, {});
    this.setState(errorState);
  }

  success([weatherObj, zipObj]) {
    const w = weatherObj.data;
    const z = zipObj.data;
    console.log("weather: ", w);
    this.setState({
      zip: z.zip_code,
      city: z.city,
      state: z.state,
      time: new Date().getTime(),
      weather: this.formatWeatherString(w.weather),
      temp: w.main.temp,
      high: w.main.temp_max,
      low: w.main.temp_min,
      pressure: w.main.pressure,
      visibility: w.visibility,
      rainfall: '0 in',
      sunrise: w.sys.sunrise,
      sunset: w.sys.sunset,
      humanTime: 'now'
    }, () => {
      if(this.state.intervalId) {
        clearInterval(this.state.intervalId);
      }
      this.updateTime(this.state.time);
    });
  }

  getWeather(zipCode) {
    Promise.all([loadWeather(zipCode), loadCity(zipCode)])
      .then(this.success.bind(this))
      .catch(this.error.bind(this));
  }

  formatWeatherString(weatherList) {
    return weatherList  
      .map(w => w.main)
      .join(', ');
  }

  smartConvert(kelvin) {
    return this.state.celsius 
      ? this.toCelsius(kelvin)
      : this.toFarenheight(kelvin);
  }

  toFarenheight(kelvin) {
    return Math.ceil((kelvin * 1.8) - 459.67);
  }

  toCelsius(kelvin) {
    return Math.ceil(kelvin - 273.15);
  }

  toInchesMercury(hpa) {
    return Math.ceil(hpa * .030);
  }

  onEnter(e) {
    const key = e.key;
    const val = e.target.value
    if(key === "Enter") this.getWeather(val);
  }

  toggleTemp(e) {
    const celsius =  e.target.checked;
    this.setState({celsius})
  }

  updateTime(time) {
    const id = setInterval(() =>{
      this.setState({
        humanTime: moment(time).fromNow()
      });
    } , 1000);
    this.setState({intervalId: id});
  }

  localTime(time) {
    return moment(time).format('LT');
  }

  degreeUnit(celsius) {
    return celsius ? 'C' : 'F';
  }

  render() {
    const { city, state, time, humanTime, weather, zip, celsius,
      temp, high, low, pressure, visibility, rainfall, sunrise, sunset } = this.state;

    return (
      <div className="wrapper">

        <div className="header">
          <span style={{marginRight: '.5%'}}>
            TODAY'S WEATHER FOR
          </span>
          <div>
            <input 
              type="text" 
              style={{marginLeft: '.5%'}}
              onKeyPress={this.onEnter.bind(this)}
              defaultValue={this.state.zip}
            />
          </div>
        </div>

        <div className="temp-toggle">
          Fahrenheit
          <label className="switch">
            <input type="checkbox" onChange={this.toggleTemp.bind(this)}/>
            <span className="slider round"></span>
          </label>
          Celsius
        </div>

        <div className="sub-header">
          <div> {city}, {state} {zip} </div>
          <div> As of {humanTime} </div>  
        </div>

        <div className="degree"> {this.smartConvert(temp)}°<span className="small-font">{this.degreeUnit(celsius)}</span> </div>

        <div className="weather-splash">
          <div id="icon"><i className="fa fa-sun-o" aria-hidden="true"/></div>
          <div> {weather} </div>
        </div>
          
        
        

        <div className="temps">
          <span>
            HIGH {this.smartConvert(high)}°
            <span className="med-font">{this.degreeUnit(celsius)}</span>
          </span>
          <span> | </span>
          <span>
            LOW {this.smartConvert(low)}°
            <span className="med-font">{this.degreeUnit(celsius)}</span>
          </span>
        </div>

        <div className="main">
          <div>
            <div>
              <span>Pressure</span>
              <span>{this.toInchesMercury(pressure)} in</span>
            </div>
            <div>
              <span>Visibility</span>
              <span>{visibility}</span>
            </div>
            <div>
              <span>Rainfall</span>
              <span>{rainfall}</span>
            </div>
          </div>
          <div>
            <div>
              <span>Sunrise</span>
              <span>{this.localTime(sunrise)}</span>
            </div>
            <div>
              <span>Sunset</span>
              <span>{this.localTime(sunset)}</span>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Container;