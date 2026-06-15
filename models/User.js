class User {
    constructor(id, name, email, phone, location, userName, password, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.userName = userName;
        this.password = password;
        this.role = role;
    }
}

module.exports = User;