"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function configRoutes(app) {
    app.route('/config-variables').get((req, res) => {
        return res.status(200).json(getConfigVariables());
    });
}
exports.default = configRoutes;
;
function getConfigVariables() {
    return {
        environment: process.env.NODE_ENV,
        apiServer: process.env.API_SERVER
    };
}
