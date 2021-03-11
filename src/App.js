import './App.css';
import { useEffect, useState } from 'react'
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
const fetchLocationIDs = (location) => {
  return new Promise((resolve, reject) => {
    fetch(`/location/search/?query=${location}`)
      .then(handleErrors)
      .then(response => resolve(response.json()))
      .catch(err => reject(err.statusText))
  })

}
const fetchCityForecast = (woeid) => {
  //api was blocking request by woeid so I used heroku server to access api
  return new Promise((resolve, reject) => {
    fetch(`https://weather-api-middle.herokuapp.com/${woeid}`, {})
      .then(handleErrors)
      .then(response => resolve(response.json()))
      .catch(err => reject(err.statusText))
  })
}


const App = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [foundCities, setFoundCities] = useState([])
  const [forecastList, setForecastList] = useState([])
  const [err, setErr] = useState()
  const handleTermChange = (e) => {
    let value = e.target.value
    setSearchTerm(value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    fetchLocationIDs(searchTerm)
      .then(data => setFoundCities(data))
      .catch(err => setErr(err))
  }
  useEffect(() => {
    let promises = []
    foundCities.forEach(city => promises.push(fetchCityForecast(city.woeid)))
    Promise.all(promises)
      .then(data => { console.log(data); setForecastList(data) })
      .catch(err => setErr(err))
  }, [foundCities])
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input className='form-element' type='text' placeholder='Enter city name' onChange={handleTermChange} />
        <input className='form-element' type='submit' value='Search' />
      </form>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Temp</th>
              <th>Max temp</th>
              <th>Min temp</th>
              <th>Weather State</th>
              <th>Wind Speed</th>
              <th>Pressure</th>
              <th>Humidity</th>
              <th>Visibility</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {forecastList.map(
              (city, i) => {
                const { consolidated_weather, title } = city
                const { the_temp, max_temp, min_temp, weather_state_name, wind_speed, air_pressure, humidity, visibility, predictability } = consolidated_weather[0]
                return (< tr key={i} >
                  <td>{title}</td>
                  <td>{Math.round(the_temp)}°C</td>
                  <td>{Math.round(max_temp)}°C</td>
                  <td>{Math.round(min_temp)}°C</td>
                  <td>{weather_state_name}</td>
                  <td>{Math.round(wind_speed)}mph</td>
                  <td>{Math.round(air_pressure)}mb</td>
                  <td>{Math.round(humidity)}%</td>
                  <td>{Math.round(visibility)}miles</td>
                  <td>{predictability}%</td>
                </tr>
                )
              }
            )}
          </tbody>
        </table>
      </div>
    </div >
  );
}

export default App;
