import dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import bodyParser from 'body-parser';
import imageRoutes from './routes/imageRoutes';

const app: express.Application = express.default();

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

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Add routes for image upload
imageRoutes(app);

const server = app.listen(process.env.PORT || 4300, () => {
  console.log('Triplog web server now running...');
  console.log(server.address());
});
