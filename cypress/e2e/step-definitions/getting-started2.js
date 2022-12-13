import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import getstarted from "../../pages/gettingstarted.spec"
const waittime = 8000;
const URL = Cypress.env("baseUrl");
Given("user on the getting started page", () => {
    cy.log("Base URL", URL);
    cy.visit(URL);
    cy.loginwithfacebookdata();
    cy.continuebuttonclick();
    cy.wait(waittime);
    cy.gettingstartedpagelanding();
    cy.wait(waittime);
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
});
Then("user sees the steps below to complete the onboarding process", () => {
    cy.stepstocompletegettingstarted();
});
Given("user alrteady have the extension installed in the background", () => {
    cy.wait(waittime)
    cy.log("in backgroud already it is installed")
})
When("user can see the status of all the steps", () => {
    getstarted.get_checkstepstatus();
})
Then("user sees all facebook friends are synced", () => {
    cy.wait(3000)
    cy.log("assuming that in prior already a facebook account is connecteed")
})
Then("user should see the congratulation banner is showing along with the total count of friends", () => {
    getstarted.get_congratulation();
    getstarted.get_clcikonprofile();
    getstarted.get_checkfriendcount();
})
