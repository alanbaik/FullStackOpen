import { useState } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [filter, setFilter] = useState('')


  const handleAdd = (ev) => {
    ev.preventDefault()
    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({name: newName, number:newNum}))
    }
  }

  const handleName = (ev) => {
    ev.preventDefault()
    setNewName(ev.target.value)
  }

  const handleNum = (ev) => {
    ev.preventDefault()
    setNewNum(ev.target.value)
  }

  const handleFilter = (ev) => {
    ev.preventDefault()
    setFilter(ev.target.value)
  }

  const filterPerson = persons.filter(per => per.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter}/>

      <h2>Add a new</h2>
      <Form handleAdd={handleAdd} handleName={handleName} handleNum={handleNum}/>

      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} filterPerson={filterPerson}/>
    </div>
  )
}

export default App