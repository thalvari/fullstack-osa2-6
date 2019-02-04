import React, {useEffect, useState} from 'react'
import personService from './services/persons'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const hook = () => {
        personService.getAll().then(initialPersons => setPersons(initialPersons))
    }
    useEffect(hook, [])
    const handleAddPerson = event => {
        event.preventDefault()
        if (persons.find(person => person.name === newName)) {
            window.alert(`${newName} on jo luettelossa`)
            return
        }
        const newPerson = {name: newName, number: newNumber}
        const updateStates = person => {
            setPersons(persons.concat(person))
            setNewName('')
            setNewNumber('')
        }
        personService.create(newPerson).then(updateStates)
    }
    const handleFilterChange = event => {
        setNewFilter(event.target.value)
    }
    const handleNameChange = event => {
        setNewName(event.target.value)
    }
    const handleNumberChange = event => {
        setNewNumber(event.target.value)
    }
    const handleDeletePerson = id => event => {
        event.preventDefault()
        if (window.confirm(`Poistetaanko ${persons.find(person => person.id === id).name}`)) {
            const filterDeleted = () => setPersons(persons.filter(person => person.id !== id))
            personService.remove(id).then(filterDeleted)
        }
    }
    const filterByName = ({name}) => name.toLowerCase().includes(newFilter.toLowerCase())
    const getFiltered = () => persons.filter(filterByName).map(person => (
            <Person
                key={person.id}
                person={person}
                handleDeletePerson={handleDeletePerson(person.id)}
            />
        )
    )
    return (
        <div>
            <h2>Puhelinluettelo</h2>
            <Filter value={newFilter} handler={handleFilterChange}/>
            <h3>Lisää uusi</h3>
            <PersonForm
                submitHandler={handleAddPerson}
                newName={newName}
                newNameHandler={handleNameChange}
                newNumber={newNumber}
                newNumberHandler={handleNumberChange}
            />
            <h3>Numerot</h3>
            <div>{getFiltered()}</div>
        </div>
    )
}

const Person = ({person, handleDeletePerson}) => (
    <form onSubmit={handleDeletePerson}>
        <label>{person.name} {person.number} </label>
        <button type="submit">poista</button>
    </form>
)

const Filter = ({value, handler}) => (
    <form>
        <label>rajaa näytettäviä: </label>
        <input value={value} onChange={handler}/>
    </form>
)

const PersonForm = ({submitHandler, newName, newNameHandler, newNumber, newNumberHandler}) => (
    <form onSubmit={submitHandler}>
        <div>
            <label>nimi: </label>
            <input value={newName} onChange={newNameHandler}/>
        </div>
        <div>
            <label>numero: </label>
            <input value={newNumber} onChange={newNumberHandler}/>
        </div>
        <button type="submit">lisää</button>
    </form>
)

export default App
