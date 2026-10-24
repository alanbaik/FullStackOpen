import { useState, useEffect } from "react";
import weatherService from "../services/weather";

const Weather = ({ capital, lat, lon }) => {
	const [weather, setWeather] = useState(null);

	useEffect(() => {
		weatherService
			.getCurrent(lat, lon)
			.then(setWeather)
			.catch(() => setWeather(null));
	}, [lat, lon]);

	if (weather === null) return null;

	return (
		<>
			<h2>Weather in {capital}</h2>
			<div>Temperature {weather.main.temp} Celsius</div>
			<img
				src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
				alt={weather.weather[0].description}
			/>
			<div>Wind {weather.wind.speed} m/s</div>
		</>
	);
};

export default Weather;
