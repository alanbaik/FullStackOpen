import Weather from "./Weather";

const Results = ({ countries, handleShow }) => {
	if (countries.length > 10) {
		return "Too many matches, specify another filter";
	} else if (countries.length === 1) {
		const c = countries[0];
		return (
			<>
				<h1>{c.name.common}</h1>
				<div>Capital {c.capital}</div>
				<div>Area {c.area}</div>
				<h2>Languages</h2>
				<ul>
					{Object.values(c.languages ?? {}).map((lan) => (
						<li key={lan}>{lan}</li>
					))}
				</ul>
				<img src={c.flags.png} alt={c.flags.alt} />

				<Weather capital={c.capital[0]} lat={c.capitalInfo.latlng[0]} lon={c.capitalInfo.latlng[1]} />
			</>
		);
	} else {
		return countries.map((c) => {
			return (
				<div key={c.cca3}>
					{c.name.common}
					<button onClick={() => handleShow(c.name.common)}>show</button>
				</div>
			);
		});
	}
};

export default Results;
