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
  return new Promise((resolve, reject) => {
    fetch(`https://weather-api-middle.herokuapp.com/2122265/${woeid}`, {})
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
        <input type='text' placeholder='Enter city name' onChange={handleTermChange} />
        <input type='submit' value='Search' />
      </form>
      <div>
        <ul>
          {forecastList.map((city, i) =>
            <li key={i}>
              {city.title}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
