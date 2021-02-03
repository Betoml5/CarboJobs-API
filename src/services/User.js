const connection = require("../services/Connection");

const getUsers = () => {
    const users = [];
    connection.query('SELECT * FROM users', (err, rows, fields) => {
        if (err) throw err;

    });

    return users;
    
}

module.exports = {getUsers};