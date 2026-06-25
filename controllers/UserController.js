const userService = require('../services/UserService');
const jwt = require('jsonwebtoken');

class UserController {

    // POST /api/users - Create a new user
    async register(req, res) {
        try {
            let { name, email, phone, location, userName, password, role, avatar } = req.body;
            if (!name || !email || !phone || !location || !userName || !password || !avatar)
                return res.status(400).json({ error: "missing fields" });
            if (typeof location.lat !== 'number' || typeof location.lng !== 'number')
                return res.status(400).json({ error: "invalid location: lat and lng must be numbers" });
            if (!/^\d{10}$/.test(phone))
                return res.status(400).json({ error: "phone number has to be exactly 10 digits" });
            
            if (password.length < 8) {
                return res.status(400).json({ error: "Password must be at least 8 characters long" });
            }
            if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
                return res.status(400).json({ error: "Password must contain a mix of both letters and numbers" });
            }
            
            role = role || 'customer';
            if (role !== 'manager' && role !== 'customer') {
                return res.status(400).json({ error: "invalid role" });
            }

            const existingUser = await userService.invalidUN(userName);
            if (existingUser) {
                return res.status(409).json({ error: "Username is already taken" });
            }
            
            const newUser = await userService.createUser({ name, email, phone, location, userName, password, role, avatar });
            res.setHeader('Location', `/api/users/${newUser.id}`);
            return res.status(201).send();
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ error: "Username is already taken" });
            }
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // GET /api/users/:id - Retrieve details of the current user
    async getProfile(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "user doesn't exist" });
            }
            return res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                userName: user.userName,
                role: user.role,
                avatar: user.avatar
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // POST /api/tokens - check if there is a user with those user name and password
    async loginAndGenerateToken(req, res) {
        try {
            const { userName, password } = req.body;
            const user = await userService.validateCredentials(userName, password);
            if (!user) {
                return res.status(401).json({ error: "Invalid user name or password" });
            }
            const role = user.role || 'user';
            const token = jwt.sign({ id: user.id, userName: user.userName, role }, 'wolt-secret', { expiresIn: '1h' });
            return res.status(200).json({ id: user.id, token });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController();