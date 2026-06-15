const userService = require('../services/UserService');
const jwt = require('jsonwebtoken');

class UserController {

    // POST /api/users - Create a new user
    register(req, res) {
        let { name, email, phone, address, userName, password, role, avatar } = req.body
        if (!name || !email || !phone || !address || !userName || !password || !avatar)
            return res.status(400).json({ error: "missing fields" })
        if (!/^\d{10}$/.test(phone))
            return res.status(400).json({ error: "phone number has to be exactly 10 digits" })
        
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }
        if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ error: "Password must contain a mix of both letters and numbers" });
        }
        
        role = role || 'customer';
        if (role !== 'manager' && role !== 'customer') {
            return res.status(400).json({ error: "invalid role" })
        }

        if (userService.invalidUN(userName)) {
            return res.status(409).json({ error: "Username is already taken" })
        }
        const newUser = userService.createUser({ name, email, phone, address, userName, password, role, avatar })
        res.setHeader('Location', `/api/users/${newUser.id}`);
        return res.status(201).send()
    }

    // GET /api/users/:id - Retrieve details of the current user
    getProfile(req, res) {
        const userId = req.params.id;
        const user = userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "user doesn't exist" });
        }
        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            userName: user.userName,
            role: user.role,
            avatar: user.avatar
        })
    }
    // POST /api/tokens - check if there is a user with those user name and password
    loginAndGenerateToken(req, res) {
        const { userName, password } = req.body;
        const user = userService.validateCredentials(userName, password);
        if (!user) {
            return res.status(401).json({ error: "Invalid user name or password" });
        }
        const role = user.role || 'user';
        const token = jwt.sign({ id: user.id, userName: user.userName, role }, 'wolt-secret', { expiresIn: '1h' });
        return res.status(200).json({ id: user.id, token });
    }

}

module.exports = new UserController();