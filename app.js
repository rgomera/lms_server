const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.send(`Server is up at PORT ${PORT}`));

app.use('/auth', require('./routes/authenticationRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));

app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
