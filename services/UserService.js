const User = require('../models/User');

class UserService {
    async createUser(data) {
        const newUser = new User(data);
        await newUser.save();
        return newUser;
    }
    async getUserById(id) {
        return await User.findById(id);
    }
    async validateCredentials(userName, password) {
        return await User.findOne({ userName, password });
    }
    async invalidUN(userName) {
        return await User.findOne({ userName });
    }
}

module.exports = new UserService();