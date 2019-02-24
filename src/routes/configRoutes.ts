import * as express from 'express';

export interface ConfigVariables {
  environment: any;
  apiServer: any;
}

export default function configRoutes(app: express.Application): void {
  app.route('/config-variables').get((req, res) => {
    return res.status(200).json(getConfigVariables());
  });
};

function getConfigVariables(): ConfigVariables {
  return {
    environment: process.env.NODE_ENV,
    apiServer: process.env.API_SERVER
  };
}
