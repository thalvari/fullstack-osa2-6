import React, {useEffect, useState} from 'react'
import personService from './services/persons'
import './App.css'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [successMsg, setSuccessMsg] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const hook = () => {
        personService.getAll().then(initialPersons => setPersons(initialPersons))
    }
    useEffect(hook, [])
    const handleAddPerson = event => {
        event.preventDefault()
        const oldPerson = persons.find(person => person.name === newName)
        const newPerson = {name: newName, number: newNumber}
        if (oldPerson) {
            if (window.confirm(`${newName} on jo luettelossa, korvataanko vanha numero uudella?`)) {
                const changeOld = updatedPerson => {
                    setPersons(persons.map(person => person.id !== oldPerson.id ? person : updatedPerson))
                    setNewName('')
                    setNewNumber('')
                    setSuccessMsg(`Muutettiin henkilön ${oldPerson.name} numeroa`)
                    setTimeout(() => {
                        setSuccessMsg(null)
                    }, 5000)
                }
                personService
                    .update(oldPerson.id, newPerson)
                    .then(changeOld)
                    .catch(() => {
                        setErrorMsg(`Henkilö ${oldPerson.name} oli jo poistettu`)
                        setTimeout(() => {
                            setErrorMsg(null)
                        }, 5000)
                        setPersons(persons.filter(person => person.id !== oldPerson.id))
                    })
            }
            return
        }
        const updateStates = person => {
            setPersons(persons.concat(person))
            setNewName('')
            setNewNumber('')
        }
        personService.create(newPerson).then(updateStates)
        setSuccessMsg(`Lisättiin ${newPerson.name}`)
        setTimeout(() => {
            setSuccessMsg(null)
        }, 5000)
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
        const oldPerson = persons.find(person => person.id === id)
        if (window.confirm(`Poistetaanko ${oldPerson.name}`)) {
            const filterDeleted = () => setPersons(persons.filter(person => person.id !== id))
            personService.remove(id).then(filterDeleted)
            setSuccessMsg(`Poistettiin ${oldPerson.name}`)
            setTimeout(() => {
                setSuccessMsg(null)
            }, 5000)
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
            <SuccessNotification message={successMsg}/>
            <ErrorNotification message={errorMsg}/>
            <Filter value={newFilter} handler={handleFilterChange}/>
            <h3>Lisää numero</h3>
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

const SuccessNotification = ({message}) => {
    if (message) {
        return <div className='success'> {message}</div>
    }
    return null
}

const ErrorNotification = ({message}) => {
    if (message) {
        return <div className='error'> {message}</div>
    }
    return null
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
