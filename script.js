//
///////////////////////
// Saule kyla
// Saule leidziasi
// Dienos ilgumas

// Feels like
// vejo kryptis
// vejo gusiai

// Oru prognoze 7 dienoms

// *Maps
    //* Google Maps API
    //* Openstreetmap API
// *Grafikai

const getTime = (unix) => {
  const date = new Date(unix * 1000)

  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const getDayLength = (unix) => {
  //might need to fix
  const hours = parseInt(unix / 3600)
  const minutes = parseInt(unix % 3600 / 60)
  const seconds = unix % 60

  return `${hours}:${minutes}:${seconds}`
}

const getWindDirection = (degrees) => {
  directions = ['Šiaurės', 'Šiaurės rytų', 'Rytų', 'Pietryčių', 'Pietų', 'Pietvakarių', 'Vakarų', 'Šiaurės vakarų'];
  
  return directions[(Math.round(degrees * 8 / 360) + 8) % 8]
}



const weather = {
    apiKey: 'b426d8fb303756ee1b6752f9bf8dc621',
    fetchWeather: function(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=lt`)
        .then((response) => response.json()).then((data) => this.displayWeather(data))
    },
    fetchFuture: function ({ lon, lat }) {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${this.apiKey}&units=metric&lang=lt`)
      .then((response) => response.json()).then((data) => this.displayForecast(data))
    },
    makeElement: function ({ classString, img, text, type }) {
      const element = document.createElement(type)

      if (classString) element.setAttribute('class', classString)
      if (img) element.setAttribute('img', img)
      if (text) element.appendChild(document.createTextNode(text))

      return element
    },
    createElements: function ({ name, temp, feels_like, humidity, icon, description, speed, sunrise, sunset, deg }) {            
      return [
        this.makeElement({ classString: 'city', text: `Oras mieste ${name}`, type: 'h2' }),
        this.makeElement({ classString: 'temp', text: `${temp}°C`, type: 'div' }),
        this.makeElement({ classString: 'feelsLike', text: `${feels_like}°C`,  type: 'div' }),
        this.makeElement({ classString: 'icon', img: `http://openweathermap.org/img/wn/${icon}@2x.png`, type: 'img' }),
        this.makeElement({ classString: 'description', text: description, type: 'div' }),
        this.makeElement({ classString: 'humidity', text: `Oro dregnumas: ${humidity}%`, type: 'div' }),
        this.makeElement({ classString: 'wind', text: `Vejo greitis: ${speed}m/s`, type: 'div' }),
        this.makeElement({ classString: 'sunrise', text: `Saulė teka: ${getTime(sunrise)}`, type: 'div' }),
        this.makeElement({ classString: 'sunset', text: `Saulė leidžiasi: ${getTime(sunset)}`, type: 'div' }),
        this.makeElement({ classString: 'daylength', text: `Dienos ilgumas: ${getDayLength(sunset - sunrise)}`, type: 'div' }),
        this.makeElement({ classString: 'windDirection', text: `Vėjo kryptis: ${getWindDirection(deg)}`, type: 'div' }),
      ]
    },
    displayForecast: function(data) {
      const { sunrise, sunset, temp, feels_like, humidity, wind_speed, wind_deg, weather } = data
      const { day, min, max, night, eve, morn } = temp
      const { day: feelDay, night: feelNight, eve: feelEve, morn: feelMorn } = feels_like
      const { main, description, icon } = weather
    },
    displayWeather: function(data) {
      const { coord, name, sys : { sunrise, sunset } } = data
      const { icon, description } = data.weather[0]
      const { feels_like, temp, humidity } = data.main
      const { deg, speed } = data.wind
      this.fetchFuture(coord)
      
      const elements = this.createElements({
        name,
        temp,
        feels_like,
        icon,
        description,
        humidity,
        speed,
        sunrise,
        sunset,
        deg
      })

      const parent = document.querySelector('.weather')
      parent.classList.remove('loading')
      elements.map(el => parent.appendChild(el))
      document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value)
    }
};

document.querySelector(".search button").addEventListener("click", function(){
    weather.search()
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        weather.search()
    }
})
