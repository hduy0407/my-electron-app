import { getAllUsers, getUseryId, createUser, updateUser } from "../models/userModel";

const getAllUsersController = (req, res) => {
    try {
        const users = getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
}

const getUserByIdController = (req, res) => {
    const { id } = req.params;
    try {
        const user = getUseryId(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
}

const createUserController = (req, res) => {
    const { username, password, email } = req.body;
    try {
        const result = createUser(username, password, email);
        res.status(201).json({ message: 'User created successfully', userId: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
}

const updateUserController = (req, res) => {
    const { id } = req.params;
    const { username, password, email } = req.body;
    try {
        const result = updateUser(id, username, password, email);
        if (result.changes > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found or no changes made' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
}

const signinUserController = (req, res) => {
    const { email, password } = req.body;
    try {
        const user = getUseryId(email);
        if (user && user.password === password) {
            res.status(200).json({ message: 'Signin successful', userId: user.id });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to signin user' });
    }
}

module.exports = {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    signinUserController
};

