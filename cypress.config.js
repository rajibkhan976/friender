const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
//const url = require("./url");

async function setupNodeEvents(on, config) {
await preprocessor.addCucumberPreprocessorPlugin(on, config);

on(
"file:preprocessor",
createBundler({
plugins: [createEsbuildPlugin.default(config)],
})
);

// Make sure to return the config object as it might have been modified by the plugin.
return config;
}

module.exports = defineConfig({
e2e: {


specPattern: "**/Features/*.feature",
supportFile: "./cypress/support/e2e.js",
//baseUrl:"https://www.chirply.io",
jsonDir: "/automation/cypress/jsonlogs/*.json",
output: 'reports/cucumber-htmlreport/cucumber_report.html',
setupNodeEvents,
},
});