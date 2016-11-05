const app = require('koa')();
// Start server
// require('./routes')(app);
app.listen(4000, function () {
    console.log('Koa server listening on %d, in %s mode', 4000, app.env);
});

module.exports = app;