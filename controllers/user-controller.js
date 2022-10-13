const { User, Thought } = require('../models');

const userController = {
    // GET all users /api/users
    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // GET a single user by _id & populated thought & friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
            path: 'thoughts',
            select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                // if no user is found, send 404
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // POST a new user /api/users
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    // PUT to update a user by its _id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body)
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err))
    },

    // DELETE to remove user by its _id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                // remove the user's associated thoughts when deleted
                return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
            })
            .then(() => {
                res.json({ message: 'User has been deleted!' });
            })
            .catch(err => res.status(400).json(err))
    },

    // /api/users/:userId/friends/:friendId
    // POST to add a new friend to a user's friend list
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendId }},
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // DELETE to remove a friend from a user's friend list
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId }},
            { new: true }
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err))
    }
};

module.exports = userController;