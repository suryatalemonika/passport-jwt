const database = require('./db');

let req = {
    username : 'gulab',
    password : 'gulab@'
}
database.updateInDb(req)