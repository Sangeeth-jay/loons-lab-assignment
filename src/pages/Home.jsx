import { useState, useEffect } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { LiaExchangeAltSolid } from "react-icons/lia";
import axios from "axios";
import bgImg from "../assets/sky.jpg";

const Home = () => {
  const [search, setSearch] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchMethod, setSearchMethod] = useState("coordinates");
  const apiKey = "37c11226a7ee12f056d87de35675b971";

  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString(undefined, options);

  const weatherIcons = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅️",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️"
  };

  const fetchWeather = async (location) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
      setError(null);

      // Fetch forecast for the next 7 days
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
      );
      setForecast(processForecast(forecastResponse.data));
    } catch (error) {
      console.error(error);
      setError("Location not found. Please try again.");
      setWeather(null);
    }
  };

  const fetchWeatherByCoordinates = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
      setError(null);

      // Fetch forecast for the next 7 days
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setForecast(processForecast(forecastResponse.data));
    } catch (error) {
      console.error(error);
      setError("Coordinates not found. Please try again.");
      setWeather(null);
    }
  };

  const processForecast = (data) => {
    const dailyForecast = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt_txt).toLocaleDateString(undefined, {
        weekday: "short",
        month: "numeric",
        day: "numeric",
      });

      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temperature: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
    });

    return Object.entries(dailyForecast).slice(0, 7); // Return next 7 days
  };

  useEffect(() => {
    fetchWeather("Colombo");
  }, []);

  const handleSearch = () => {
    if (searchMethod === "location") {
      fetchWeather(search);
    } else if (searchMethod === "coordinates") {
      fetchWeatherByCoordinates(latitude, longitude);
    }
  };

  const toggleSearchMethod = () => {
    if (searchMethod === "location") {
      setSearchMethod("coordinates");
      setSearch(""); 
      setLatitude(""); 
      setLongitude(""); 
    } else {
      setSearchMethod("location");
      setLatitude(""); 
      setLongitude(""); 
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-6"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">Mr. Arthur`s Weather</h1>

      {/* Search Bar */}
      <div className="w-full max-w-md flex items-center justify-center gap-2 p-2 bg-white opacity-95 rounded-lg mb-2">
        {searchMethod === "location" ? (
          <>
            <input
              type="text"
              placeholder="Enter your location"
              className="w-full border rounded-md p-2 outline-none focus:ring-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter latitude"
              className="w-full border rounded-md p-2 outline-none focus:ring-1"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter longitude"
              className="w-full border rounded-md p-2 outline-none focus:ring-1"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </>
        )}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 active:scale-95"
        >
          <RiSearch2Line className="w-6 h-6" />
        </button>
        <button
          onClick={toggleSearchMethod}
          className="bg-slate-50 text-blue-600 rounded-md p-2 hover:bg-slate-100 active:scale-95"
        >
          <LiaExchangeAltSolid className="w-6 h-6" />
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="bg-white opacity-95 p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center text-slate-700">
            {formattedDate}
          </h2>

          {/* Current Weather */}
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold">{weather.name}</h3>
            <p className="text-6xl">{weatherIcons[weather.weather[0].icon] || "🌤️"}</p>
            <p className="text-4xl font-bold">{weather.main.temp}°C</p>
            <p className="text-sm text-gray-600">{weather.weather[0].description}</p>
          </div>

          {/* 3-Day Forecast */}
          {forecast && !showMore && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-2">3-Day Forecast</h4>
              {forecast.slice(0, 3).map(([day, details], index) => (
                <div key={index} className="flex justify-between p-2 border-b">
                  <span className="font-medium">{day}</span>
                  <span>{details.temperature}°C</span>
                  <span>{weatherIcons[details.icon] || "🌦️"}</span>
                  <span className="text-gray-600">{details.description}</span>
                </div>
              ))}
            </div>
          )}

          <button
            className="mt-6 w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "View Less" : "View More Details"}
          </button>

          {/* 7-Day Forecast */}
          {showMore && forecast && (
            <div className="space-y-4 mt-6">
              <h4 className="text-lg font-semibold mb-2">7-Day Forecast</h4>
              {forecast.map(([day, details], index) => (
                <div key={index} className="flex justify-between p-2 border-b">
                  <span className="font-medium">{day}</span>
                  <span>{details.temperature}°C</span>
                  <span>{weatherIcons[details.icon] || "🌦️"}</span>
                  <span className="text-gray-600">{details.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
