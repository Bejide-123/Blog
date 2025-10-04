const express = require('express');
//const sequelize = require('./config/sequelize');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.get('/', (req,res) => {
    res.status(201).send({msg: "server is running"});
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});





app.listen(PORT, async() => {
    try{
        console.log(`server running on http://localhost:${PORT}`);
        await sequelize.authenticate();
        console.log('connection successfully established with the database')
    } catch (error) {
        console.log('sorry could not establish db connection' + error.message)
    }
});