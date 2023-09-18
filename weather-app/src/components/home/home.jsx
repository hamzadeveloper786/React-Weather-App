import { useState, useRef, useEffect } from "react";
import axios from "axios";
import WeatherCard from "../weatherWidget/card";
import './home.css'

const Home = () => {

  const [weatherData, setWeatherData] = useState([]);
  const cityNameRef = useRef(null);

  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    
    const controller = new AbortController();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (location) => {
        console.log("location: ", location);

        try {
          let API_KEY = "72df1165103b0c7ca19c5636f5c6d129";
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
    console.log("cityName: ", cityNameRef.current.value);

    let API_KEY = "72df1165103b0c7ca19c5636f5c6d129";
    try {
      setIsLoading(true);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityNameRef.current.value}&appid=${API_KEY}&units=metric`
      );

      console.log(response.data);
      setWeatherData([response.data, ...weatherData]);
      setIsLoading(false);
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
    <div className="head bg-[#171d2501] flex flex-col justify-right items-center gap-[1em] sticky top-0 z-20">
      <div className="top">
    <h1 className="z-[30] mt-32 mb-[1em] flex justify-center itens-center gap-[0.5em] text-center w-[100%] text-[#fec55e] bi bi-cloud-sun text-[1.5em]"><span className="text-[#fff]">Weather</span><span className="text-[#ff6677]">App</span></h1>
      <form onSubmit={submitHandler} className="z-[30] mb-[1em] w-[100%] flex justify-center items-center gap[1em] bg-[#fff] p-[0.5em] rounded-[15px] text-[#fff]">

        <input
          id="cityNameInput"
          type="text"
          required
          minLength={2}
          maxLength={20}
          placeholder="Enter City Name"
          className="p-[0.5em] w-[100%]"
          ref={cityNameRef}
        />
        <br />
        <button type="submit" className="text-[#fff] bg-[#ff6677] p-[0.5em] rounded-[10px]">Get Weather</button>
      </form>
      </div>
      {isLoading ? <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> : null}

      {weatherData.length || currentLocationWeather || isLoading ? null : <div>No Data</div>}

      {weatherData.map((eachWeatherData, index) => {
        return <WeatherCard key={index} weatherData={eachWeatherData} />;
      })}

      {currentLocationWeather ? <WeatherCard weatherData={currentLocationWeather} /> : null}
    </div>
    </div>
  );
};

export default Home;
