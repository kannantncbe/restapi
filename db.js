const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,    // the number of connections node.js will hold open to our database
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT

});

let db = {};

db.getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employee ', (error, employees) => {
            if (error) {
                return reject(error);
            }
            return resolve(employees);
        });
    });
};

db.getOneEmployee = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM employee WHERE id= ?', [id], (error, employee) => {
            if (error) {
                return reject(error);
            }
            return resolve(employee);
        });
    });
};

db.insertEmployee = (firstName, lastName, email) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO employee (first_name, last_name, email) VALUES (?, ?, ?)', [firstName, lastName, email], (error, result) => {
            if (error) {
                return reject(error);
            }

            return resolve(result.insertId);
        });
    });
};


db.updateEmployee = (firstName, lastName, email, id) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE employee SET first_name = ?, last_name= ?, email= ? WHERE id = ?', [firstName, lastName, email, id], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};

db.deleteEmployee = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE employee WHERE id= ?', [id], (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();

        });
    });
};

module.exports = db;