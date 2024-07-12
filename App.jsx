import { useEffect, useState } from 'react'
import './App.css';
import PropTypes from "prop-types";
import cloudyIcon from'./assets/cloudy.png';
import rainyIcon from'./assets/rainy.png';
import sunnyIcon from'./assets/sunny.png';
import stormyIcon from'./assets/stormy.png';
import humidityIcon from'./assets/humidity.png';
import windIcon from'./assets/wind.png';
import moonIcon from'./assets/moon.png';
import cloudsIcon from'./assets/clouds.png';
import snowIcon from'./assets/snow.png';

const WeatherDetails = ({ icon ,temp ,city ,country ,lat ,log ,humidity ,wind }) => {
  return (
    <div>
      <div className='image'>
        <img src={icon} alt='Image' />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>  
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>  
          <span className="log">longitude</span>
          <span>{log}</span>
        </div>  
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind}km/h</div>
            <div className="text">wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country:PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
};
function App() {
  let api_key = "2084cab568f45dc464a118979b390654";

  const [text,setText]=useState("Madurai");
  const [icon, setIcon] = useState(sunnyIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound,setCityNotFound]=useState(false);
  const [loading, setLoading]=useState(false);
  const [error, setError]=useState(null);

  const weaatherIconMap={
    "01d": sunnyIcon,
    "01n": moonIcon,
    "02d": cloudsIcon,
    "02n": cloudsIcon,
    "03d": cloudyIcon,
    "03n": cloudyIcon,
    "04d": cloudyIcon,
    "04n": cloudyIcon,
    "09n": rainyIcon,
    "09d": rainyIcon,
    "10d": stormyIcon,
    "10n": stormyIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }
  const search=async ()=>{
    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      console.log(data);
      if(data.cod==="404"){
        console.error("city not found!!!")
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode=data.weather[0].icon;
      setIcon(weaatherIconMap[weatherIconCode] || sunnyIcon);
      setCityNotFound(false);

    }catch(error){
     console.error("An error occurred:",error.message);
     setError("An error occured whule fetching data");
    }finally{
      setLoading(false);
    }
  }
  const handleCity = (e)=>{
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if(e.key === "Enter")
      search();
  };

  useEffect(function (){
    search();
  }, {});
  return (
    <div>
      <div className='container'>
        <div className='input-container'>
          <input type='text'
          className='cityInput' 
          placeholder='Search City' 
          onChange={handleCity}
          value={text} 
          onKeyDown={handleKeyDown} />
        </div>
        
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found"> City not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />
}

        <p className="copyright">
          Designed by<span> sansanjay </span>
        </p>
      </div>
    </div>
  )
}

export default App;
