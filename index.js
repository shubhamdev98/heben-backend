const express = require('express');
const bodyParser = require('body-parser');
const db = require('./src/models');
const cors = require('cors')

const app = express();

app.use(cors())
app.use(bodyParser.json());

// Sync DB
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

// Routes
const quotationRoutes = require('./src/routes/quotation.routes');
app.use('/api', quotationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
