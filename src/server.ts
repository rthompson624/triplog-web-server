import dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import bodyParser from 'body-parser';
import imageRoutes from './routes/imageRoutes';
import configRoutes from './routes/configRoutes';

dotenv.config();
if (!process.env.NODE_ENV) {
  console.log('NODE_ENV environment variable not defined!');
} else {
  console.log('Environment: ' + process.env.NODE_ENV);
}

const app: express.Application = express.default();

// Enable CORS
app.use(cors.default());

// Configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Redirect http to https when in production
const environment = process.env.NODE_ENV;
if (environment === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] != 'https') {
      res.redirect(301, 'https://' + req.headers.host + req.url);
    } else {
      return next();
    }
  });
}

// Create default route to serve client app
const clientDir = __dirname + '/client/';
app.use(express.static(clientDir));

// Add routes
imageRoutes(app);
configRoutes(app);

// Return index.html for all other routes (client is SPA)
app.get('/*', function(req,res) {
  res.sendFile(__dirname + '/client/index.html');
});
  
// Start web server
let port: any;
if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
  port = process.env.PORT;
  console.log('Heroku environment detected. Using port ' + port);
} else {
  port = 4300;
  console.log('Local environment detected. Using port ' + port);
}
const server = app.listen(port, () => {
  console.log('Triplog web server now running...');
  console.log(server.address());
});
