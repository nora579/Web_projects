const cityInput = document.querySelector('.city-in')
const searchBtn = document.querySelector('.search-btn')

const weatherSection = document.querySelector('.weather-info')
const notFound = document.querySelector('.not-found')
const searchSection = document.querySelector('.search-city')

const countryName = document.querySelector('.country-name')
const tempTxt = document.querySelector('.temp-txt')
const condition = document.querySelector('.condition-txt')
const humidityValue = document.querySelector('.humidity-value')
const windValue = document.querySelector('.wind-value')
const weatherImg = document.querySelector('.weather-summary-img')
const currentDate = document.querySelector('.current-date')

const forecastItems = document.querySelector('.forecast-items')

const APIkey = 'd8cbda3d981898381d6f85e889ba3720'
// const APIkey = '1206207b0c3848d08ef235903251509'


searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != ''){
        updateWeather(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeather(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${APIkey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getWeatherIcon(id){
    if(id <= 232) return 'images/weather/thunderstorm.svg'
    if(id <= 321) return 'images/weather/drizzle.svg'
    if(id <= 531) return 'images/weather/rain.svg'
    if(id <= 622) return 'images/weather/snow.svg'
    if(id <= 781) return 'images/weather/atmosphere.svg'
    if(id == 800) return 'images/weather/clear.svg'
    if(id <= 804) return 'images/weather/clouds.svg'

    console.log(id)
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
    // console.log(currentDate)
}

async function updateWeather(city){
    const weatherData = await getFetchData('weather', city)

    if(weatherData.cod != 200){
        DisplaySection(notFound)
        return
    }
    console.log(weatherData)

    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData

    countryName.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    condition.textContent = main
    humidityValue.textContent = humidity + '%'
    windValue.textContent = speed + ' m/s'

    weatherImg.src = `${getWeatherIcon(id)}`
    currentDate.textContent = getCurrentDate()

    await updateForecast(city)

    DisplaySection(weatherSection)
}

async function updateForecast(city){
    const forecastData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    
    forecastItems.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            console.log(forecastWeather)
            updateForecastItems(forecastWeather)
        }
    })

    console.log(todayDate)
}

function updateForecastItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOptions = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOptions)

    const forecastItem = `
        <div class="forecast-item">
          <h5 class="forecast-date regular-txt">${dateResult}</h5>
          <img src="${getWeatherIcon(id)}" width="45px" alt="" class="forecast-item" style="background-color: transparent;">
          <h5 class="forecast-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItems.insertAdjacentHTML('beforeend', forecastItem)
}

function DisplaySection(section){
    [weatherSection, searchSection, notFound]
        .forEach(section => section.style.display = 'none');

    section.style.display = 'flex'
}