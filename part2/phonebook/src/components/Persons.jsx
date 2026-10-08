const Persons = ({ filter, persons, filterPerson }) => {
  if (filter.length === 0 ) {
    return persons.map(p => <div key={p.name}>{p.name} {p.number}</div>)
  } else {
    return filterPerson.map(p => <div key={p.name}>{p.name} {p.number}</div>)
  }
}

export default Persons