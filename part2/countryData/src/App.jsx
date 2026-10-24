import { useState, useEffect } from "react";
import Find from "./components/Find";
import Results from "./components/Results";
import countryServices from "./services/country";

const App = () => {
	const [find, setFind] = useState("");
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		countryServices.getAll().then(setCountries);
	}, []);

	const handleFind = (ev) => {
		ev.preventDefault();
		const name = ev.target.value;
		setFind(name);
	};

    const handleShow = (name) => {
		setFind(name);
	};

	const filtered = countries.filter((c) => c.name.common.toLowerCase().includes(find.toLowerCase()));

	return (
		<div>
			<Find handleFind={handleFind} />

			<Results countries={filtered} handleShow={handleShow} />
		</div>
	);
};

export default App;
