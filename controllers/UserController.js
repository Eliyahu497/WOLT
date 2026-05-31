const userService = require('../services/UserService');

class UserController {

    // POST /api/users - Create a new user
    register(req, res) {
        const {name, email, phone, address, userName, password} = req.body
        if (!name ||!email || !phone || !address || !userName || !password)
            return res.status(400).json({ error: "missing fields"})
        if (!/^\d{10}$/.test(phone))
            return res.status(400).json({ error: "phone number have to be exactly 10 digits"})
        if (userService.invalidUN(userName)) {
            return res.status(404).json({ error: "Invalid user name"})
        }
        const newUser = userService.createUser({name, email, phone, address, userName, password})
        res.status(201).json({
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            phone: newUser.phone, 
            address:newUser.address, 
            userName:newUser.userName
        })
    }

    // GET /api/users/:id - Retrieve details of the current user
    getProfile(req, res) {
        const userId = req.params.id;
        const user = userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "user doesn't exist" });
        }
        return res.status(200).json({
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            phone: newUser.phone, 
            address:newUser.address, 
            userName:newUser.userName
        })
    }
    // POST /api/tokens - check if there is a user with those user name and password
    loginAndGenerateToken(req, res) {
        const {userName, password} = req.body;
        const user = userService.validateCredentials(userName, password);
         if (!user) {
            return res.status(404).json({ error: "Invalid user name or password" });
        }
        return res.status(200).json({id: user.id});
    }
    
}

module.exports = new UserController();