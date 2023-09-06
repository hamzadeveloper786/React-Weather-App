import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import WeatherCard from '../weatherWidget/card';
import './home.css';

const Home = () => {

    const [weatherData, setWeatherData] = useState(null);
    const cityInput = useRef(null);

    const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const controller = new AbortController();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (location) => {
        console.log("location: ", location);

        try {
          let API_KEY = `72df1165103b0c7ca19c5636f5c6d129`;
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}&units=metric`,
            {
              signal: controller.signal,
            }
          );
          console.log(response.data);

          setCurrentLocationWeather(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error.data);
          setIsLoading(false);
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    return () => {
      // cleanup function
      controller.abort();
    };
  }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("City Name", cityInput.current.value);

        let API_KEY = `72df1165103b0c7ca19c5636f5c6d129`;

        //Getting request through api example

        try {
          setIsLoading(true);
            const response = await axios
                .get(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput.current.value}&appid=${API_KEY}&units=metric`)
            // handle success
            setWeatherData([response.data, ...weatherData]);
            setIsLoading(false);
            cityInput.current.value = "";
        } catch (e) {
            // handle error
            console.log(e?.data);
            setIsLoading(false);
        }
    }
    return <div>
    <div className="head bg-[#171d2501] flex flex-col justify-right items-center gap-[1em] sticky top-0 z-20">
      <h1 className="z-[30] mb-[1em] flex justify-center itens-center gap-[0.5em] text-center w-[100%] text-[#fec55e] bi bi-cloud-sun text-[1.5em]"><span className="text-[#fff]">Weather App</span></h1>
      <form onSubmit={submitHandler} className="z-[30] mb-[1em] w-[100%] flex justify-center items-center gap[1em] bg-[#fff] p-[0.5em] rounded-[15px]">
        <input
          id="cityNameInput"
          type="text"
          required
          minLength={2}
          maxLength={20}
          ref={cityInput}
          className="bg-[#fff] p-[0.5em] w-[100%]"
          placeholder="Enter City Name..."
        />
        <br />
        <button type="submit" >Search</button>
      </form>
      </div>

      <div className="result p-[1em] w-[100%] flex flex-wrap justify-center items-start h-[100%]">
      {weatherData.length || currentLocationWeather || isLoading ? null : <div>No Data</div>}

{weatherData.map((eachWeatherData, index) => {
  return <WeatherCard key={index} weatherData={eachWeatherData} />;
})}

    {currentLocationWeather ? <WeatherCard weatherData={currentLocationWeather} /> : null}
    </div>
    </div>
};

export default Home;