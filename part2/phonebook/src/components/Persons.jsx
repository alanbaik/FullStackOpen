const Persons = ({ filterPerson, erasePerson }) => {
	return filterPerson.map((p) => (
		<div key={p.id}>
			{p.name} {p.number}
			<button onClick={() => erasePerson(p.id, p.name)}>delete</button>
		</div>
	));
};

export default Persons;
