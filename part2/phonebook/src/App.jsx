import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import personServices from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNum, setNewNum] = useState("");
	const [filter, setFilter] = useState("");
	const [notifMessage, setNotifMessage] = useState(null);
	const [notifType, setNotifType] = useState(true);

	useEffect(() => {
		personServices.getAll().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);

	const handleAdd = (ev) => {
		ev.preventDefault();
		if (persons.some((p) => p.name === newName && p.number === newNum)) {
			alert(`${newName} is already added to phonebook`);
		} else if (persons.some((p) => p.name === newName)) {
			if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
				const existing = persons.find((p) => p.name === newName);
				personServices
					.update(existing.id, { ...existing, number: newNum })
					.then((updatedPerson) => {
						setPersons(persons.map((p) => (p.id !== existing.id ? p : updatedPerson)));
					})
					.then(() => {
						setNotifMessage(`Person '${newName}' was updated in server`);
						setNotifType(true);
						setTimeout(() => {
							setNotifMessage(null);
						}, 5000);
					})
					.catch((err) => {
						setNotifMessage(`Info of '${newName}' has already been removed from server`);
						setNotifType(false);
						setTimeout(() => {
							setNotifMessage(null);
						}, 5000);
                        setPersons(persons.filter((n) => n.id !== existing.id));
					});
			}
		} else {
			const newPerson = { name: newName, number: newNum };
			personServices
				.create(newPerson)
				.then((created) => setPersons(persons.concat(created)))
				.then(() => {
					setNotifMessage(`Person '${newName}' was created in server`);
					setNotifType(true);
					setTimeout(() => {
						setNotifMessage(null);
					}, 5000);
				})
				.catch((err) => {
					setNotifMessage(`Unable to create Person '${newName}' in server`);
					setNotifType(false);
					setTimeout(() => {
						setNotifMessage(null);
					}, 5000);
				});
		}
	};

	const handleName = (ev) => {
		ev.preventDefault();
		setNewName(ev.target.value);
	};

	const handleNum = (ev) => {
		ev.preventDefault();
		setNewNum(ev.target.value);
	};

	const handleFilter = (ev) => {
		ev.preventDefault();
		setFilter(ev.target.value);
	};

	const erasePerson = (id, name) => {
		if (window.confirm(`Delete ${name} ?`)) {
			personServices
				.erase(id)
				.then(() => {
					const newPersons = persons.filter((p) => p.id !== id);
					setPersons(newPersons);
				})
				.catch((error) => {
					alert(`the person '${name}' was already deleted from server`);
					setPersons(persons.filter((n) => n.id !== id));
				});
		}
	};

	const filterPerson = persons.filter((per) => per.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={notifMessage} type={notifType} />
			<Filter handleFilter={handleFilter} />

			<h2>Add a new</h2>
			<Form handleAdd={handleAdd} handleName={handleName} handleNum={handleNum} />

			<h2>Numbers</h2>
			<Persons filter={filter} persons={persons} filterPerson={filterPerson} erasePerson={erasePerson} />
		</div>
	);
};

export default App;
