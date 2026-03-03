'use strict';

const express = require('express');
const cors = require('cors');

const contactRouter = require('./routes/contact');
const projectsRouter = require('./routes/projects');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);

app.listen(PORT, () => {
  process.stdout.write(`Server running on port ${PORT}\n`);
});

module.exports = app;
