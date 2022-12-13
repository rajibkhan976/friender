const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const addCucumberPreprocessorPlugin = require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
const { readFileSync } = require('fs');


module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.extensions.push('C:/Users/Swagata/Documents/friender/dist')
        return launchOptions
        })
      // for environment
      // implement node event listeners here
      const env = config.env.ENV
      const text = readFileSync(`./cypress/config/${env}.json`)
      const values = JSON.parse(text)
      config.baseUrl = values.baseUrl;
      
      config.env = {
        ...values
      }
      // end env setup
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });
      on("file:preprocessor", bundler);
      await addCucumberPreprocessorPlugin(on, config);
      console.log("Config", config)
      return config;
    },
    videoUploadOnPasses:false,
    failOnStatusCode: false,
    chromeWebSecurity: false,
    projectId: "ofjfkz",
    specPattern: "cypress/e2e/***/**/*.feature",
    reporter: "json",
    viewportHeight:900,
    viewportWidth: 1440,
    reporterOptions:
    {
      outputDir: "./cucumber-json",
    },
  }
});