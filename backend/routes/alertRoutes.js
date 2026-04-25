const express = require('express');
const router = express.Router();
const { getAlerts, createAlert } = require('../controllers/alertController');

router.route('/').get(getAlerts).post(createAlert);

module.exports = router;
