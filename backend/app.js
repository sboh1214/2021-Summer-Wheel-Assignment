const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sequelize = require('./utils/sequelize');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('./socket/socketIO')(server);
const socketIOHandler = require('./socket/socketIOHandler')(io);
const api_auth = require('./routes/auth');
const api_id = require('./routes/id');
const authNeeded = require('./middlewares/auth-api');
const { exec } = require('child_process');

//middleware
app.use(bodyParser.json())
app.use((err, req, res, next) => {
    console.log(err);
    if (!res.headersSent) {
        res.status(500).send('500ISE T_T');
    }
});

app.get('/api/id', authNeeded, api_id);
app.post('/api/auth', api_auth);


app.get('/', (req, res) => {
    res.status(419).json({
        ok: true,
        me: 'teapot'
    });
});

(async () => {
    await sequelize.sync();
    const port = parseInt(process.env.PORT || '3008');
    server.listen(port);

    console.log("Backend listening from " + port);

    exec('ldapwhoami', (error, stdout, stderr) => {
        exec('ldapwhoami -x', (error, stdout, stderr) => {
            exec('ldapwhoami -x -H ${process.env.SPARCS_LDAP_HOST}', (error, stdout, stderr) => {
        
            });
        });
    });
})();

