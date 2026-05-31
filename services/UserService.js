const { v4: uuidv4 } = require('uuid');
const InMemoryDB = require('../InMemoryDB');
const User = require('../models/User');

class UserService {
    createUser(data) {
        const id = uuidv4();
        const newUser = new User(id, data.name, data.email, data.phone, data.address, data.userName, data.password || []);
        InMemoryDB.users.push(newUser);
        return newUser;
    }
    getUserById(id) {
        return InMemoryDB.users.find(u => u.id === id) || null; 
    }
    validateCredentials(userName, password) {
        return InMemoryDB.users.find(u => u.userName === userName && u.password === password) || null; 
    }
    validP(phone) {
        return /^\d{10}$/.test(phone);
    }
    invalidUN(userName) {
        return InMemoryDB.users.find(u => u.userName === userName) || null; 
    }
}

module.exports = UserService;