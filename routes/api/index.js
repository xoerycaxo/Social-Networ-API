const router = require('express').Router();
const userRoutes = require ('./user-routes');
const thoughtRoutes = require('./thought-routes');

// add prefix to routes
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;