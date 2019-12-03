const environment = process.env.NODE_ENV || 'development';    // set environment
const configuration = require('../knexfile')[environment];   // pull in correct db with env configs
const database = require('knex')(configuration);           // define database based on above
const bcrypt = require('bcrypt')                         // bcrypt will encrypt passwords to be saved in db
const crypto = require('crypto') 

const signUp = (req, res) => {
    const user = req.body;
    hashPassword(user.password)
        .then((hashedPassword) => {
            delete user.password;
            user.password_digest = hashedPassword;
        })
        .then(() => user.token = createToken())
        .then(() => createUser(user))
        .then(user => {
            delete user.password_digest;
            res.status(201).json({ user });
        })
        .catch((err) => console.error(err));
}

const signIn = (req, res) => {
    const userReq = req.body;
    let user;
    findUser(userReq)
        .then(foundUser => {
            user = foundUser;
            return checkPassword(userReq.password, user);
        })
        .then((res) => createToken())
        .then((token) => updateUserToken(user, token))
        .then(() => {
            delete password_digest;
            res.status(200).json({ user });
        })
        .catch((err) => console.log(err));
}

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            err ? reject(err) : resolve(hash);
        })
    })
}

const findUser = (user) => {
    return database.raw("SELECT * FROM users WHERE username = ?", [user.username])
    .then((data) => data.rows[0]); // возвращает самый верхний ряд нашего запроса
}

const checkPassword = (password, user) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password_digest, (err, responce) => {
            if (err) {
                reject(err);
            }
            else if (responce) {
                resolve(responce);
            }
            else {
                reject(new Error('Passwords do not match'));
            }
        })
    })
}

const updateUserToken = (user, token) => {
    return database.raw(`UPDATE users SET token = ? WHERE id = ? RETURNING id, username, token`, [token, user.id])
    .then((res) => res.rows[0]);
}

const createUser = (user) => {
    return database.raw(
        `INSERT INTO users (username, password_digest, token, created_at) VALUES (?, ?, ?, ?) RETURNING id, username, created_at, token`,
        [user.username, user.password_digest, user.token, new Date()]   
    )
}

const createToken = () => {
    try {
        const token = crypto.randomBytes(16);
        console.log(token.toString('base64'));
        return token.toString('base64');
    }
    catch(err) {
        throw err;
    }
}

module.exports = {
    signUp,
    signIn
}