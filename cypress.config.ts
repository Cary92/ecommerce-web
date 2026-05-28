import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    defaultCommandTimeout: 30000,
    setupNodeEvents(on, config) {;
      const env = config.env['ENVIRONMENT'] || 'dev';
      config.env['currentEnv'] = env;
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  video: true,
  videoCompression: false,
  screenshotOnRunFailure: true,
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
