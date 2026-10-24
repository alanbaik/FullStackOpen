import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5";
const api_key = import.meta.env.VITE_API_KEY;

const getCurrent = (lat, lon) => {
	return axios
		.get(`${baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
		.then((res) => res.data);
};

export default { getCurrent };
