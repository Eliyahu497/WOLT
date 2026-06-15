class User {
    constructor(id, name, email, phone, address, userName, password, role = 'customer', avatar) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.userName = userName;
        this.password = password;
        this.role = role || 'customer';
        this.avatar = avatar;
    }
}

module.exports = User;