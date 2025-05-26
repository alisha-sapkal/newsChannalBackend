"use client";

import React, { useEffect, useState } from "react";

type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: [
    {
      description: string;
    }
  ];
};

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          setError("Unable to retrieve location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);

  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(weatherData?.main)

  return (
    <div className="weather">
      {weatherData ? (
        <div>
          <span>{currentDate}</span>
          <span>
            {weatherData.name} {Math.round(weatherData.main.temp)}°C
          </span>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Weather;
