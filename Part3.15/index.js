const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

require('dotenv').config()

const Person = require('./models/persons')

app.use(cors())
app.use(express.static('dist'))

morgan.token('reqBody', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))
app.use(express.json())

let persons = []

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const numberOfPersons = persons.length
  const currentTime = new Date().toString()
  const info = `Phonebook has info for ${numberOfPersons} people.<br>${currentTime}`
  response.send(info)
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})