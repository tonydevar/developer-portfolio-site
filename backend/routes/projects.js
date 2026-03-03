'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');

router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(PROJECTS_FILE, 'utf8');
    const projects = JSON.parse(raw);
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load projects' });
  }
});

module.exports = router;
