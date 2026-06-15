const { v4: uuidv4 } = require('uuid');
const InMemoryDB = require('../InMemoryDB');
const User = require('../models/User');

class UserService {
    createUser(data) {
        const id = uuidv4();
        const newUser = new User(id, data.name, data.email, data.phone, data.location, data.userName, data.password, data.role, data.avatar);
        InMemoryDB.users.push(newUser);
        return newUser;
    }
    getUserById(id) {
        return InMemoryDB.users.find(u => u.id === id) || null;
    }
    validateCredentials(userName, password) {
        return InMemoryDB.users.find(u => u.userName === userName && u.password === password) || null;
    }
    invalidUN(userName) {
        return InMemoryDB.users.find(u => u.userName === userName) || null;
    }
}

module.exports = new UserService();