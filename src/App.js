import './App.css';
import { useState } from 'react'
const URL = 'https://www.metaweather.com/api'
const fetchWeather = async (city) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  const response = await fetch(`${URL}/location/search/?query=${city}`, { headers })
  const data = await response.json();
  return data

}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const handleTermChange = (e) => {
    let value = e.target.value
    setSearchTerm(value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(fetchWeather(searchTerm))

  }
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Enter city name' onChange={handleTermChange} />
        <input type='submit' value='Search' />
      </form>
    </div>
  );
}

export default App;
