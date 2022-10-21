import { generate } from "cucumber-html-reporter";

const options = ({
  jsonDir: "/cypress/jsonlogs", // ** Path of .json file **//
  reportPath: "D:/Friender_Automation/cypress/reports/cucumber-htmlreport.html",
  output: 'reports/cucumber-htmlreport/cucumber_report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  scenarioTimestamp: true,
  metadata: {
    browser: {
      name: "chrome",
      version: "XX",
    },
    device: "Local test machine",
    platform: {
      name: "Windows",
      version: "10 pro",
    },
  },
});

generate(options);