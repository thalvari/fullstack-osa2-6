import React, {useState} from 'react'

const App = ({init}) => {
    const [persons, setPersons] = useState(init)
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const addPerson = event => {
        event.preventDefault()
        if (persons.map(person => person.name).includes(newName)) {
            window.alert(`${newName} on jo luettelossa`)
            return
        }
        setPersons(persons.concat({name: newName, number: newNumber}))
        setNewName('')
        setNewNumber('')
    }
    const handleFilterChange = event => {setNewFilter(event.target.value)}
    const handleNameChange = event => {setNewName(event.target.value)}
    const handleNumberChange = event => {setNewNumber(event.target.value)}
    const rows = () => persons.filter(filterByName).map(person => <Person key={person.name} person={person}/>)
    const filterByName = ({name}) => name.toLowerCase().includes(newFilter.toLowerCase())
    return (
        <div>
            <h2>Puhelinluettelo</h2>
            <Filter value={newFilter} handler={handleFilterChange}/>
            <h3>Lisää uusi</h3>
            <PersonForm
                submitHandler={addPerson}
                newName={newName}
                newNameHandler={handleNameChange}
                newNumber={newNumber}
                newNumberHandler={handleNumberChange}
            />
            <h3>Numerot</h3>
            {rows()}
        </div>
    )
}

const Person = ({person}) => <div>{person.name} {person.number}</div>

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
