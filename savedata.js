const database = require('./db');

let req = {
    username : 'gulab',
    email : 'gulab@gmail.com',
    password : 'gulab'
}
database.saveInDb(req)