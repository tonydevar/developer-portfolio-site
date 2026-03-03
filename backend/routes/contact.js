'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { validateContact } = require('../middleware/validate');

const router = express.Router();
const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');

router.post('/', (req, res) => {
  const result = validateContact(req.body);

  if (!result.valid) {
    return res.status(400).json({ success: false, errors: result.errors });
  }

  const entry = {
    ...result.data,
    timestamp: new Date().toISOString(),
  };

  let contacts = [];
  try {
    const raw = fs.readFileSync(CONTACTS_FILE, 'utf8');
    contacts = JSON.parse(raw);
  } catch {
    contacts = [];
  }

  contacts.push(entry);

  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf8');

  return res.status(200).json({ success: true });
});

module.exports = router;
