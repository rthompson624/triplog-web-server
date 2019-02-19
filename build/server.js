"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express = __importStar(require("express"));
const cors = __importStar(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const app = express.default();
// Enable CORS
app.use(cors.default());
// Configure body parser
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Redirect http to https when in production
const environment = process.env.NODE_ENV;
if (environment === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] != 'https') {
            res.redirect(301, 'https://' + req.headers.host + req.url);
        }
        else {
            return next();
        }
    });
}
// Create default route to serve client app
const clientDir = __dirname + '/client/';
app.use(express.static(clientDir));
// Add routes for image upload
imageRoutes_1.default(app);
const server = app.listen(process.env.PORT || 4300, () => {
    console.log('Triplog web server now running...');
    console.log(server.address());
});
