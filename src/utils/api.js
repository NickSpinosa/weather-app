//httpClient must implement the axios interface
//using partial application to enable mocking for unit tests
//as this api layer grows I would implement a `builder` function to return
//  a list of the applied functions this is a functional approach to dependancy injection
const getWeather = (httpClient, apiKey) => {
  return zip => {
    return httpClient.get(`http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&APPID=${apiKey}`);
  }
}

const getCityFromZip = (httpClient, apiKey) => {
  return zip => {
    return httpClient.get(`https://www.zipcodeapi.com/rest/${apiKey}/info.json/${zip}/degrees`);
  }
}

export {getWeather, getCityFromZip};