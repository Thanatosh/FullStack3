const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Correct command is "node mongo.js password name number"')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://Thanatos:${password}@phonebook.jqpglrg.mongodb.net/savedPersons?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personsSchema)

const person = new Person({
  name: name,
  number: number
})

if (process.argv.length === 5) {
    person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    console.log("Phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}