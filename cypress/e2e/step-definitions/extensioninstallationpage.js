import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
const waittime = 5000;
const URL = Cypress.env("baseUrl");
import extension from "../../pages/extensioninstallation.spec"
Given("user successfully logs in to the portal", () => {
    cy.visit(URL);
    cy.loginvalid();
    cy.continuebuttonclick();
});
When("user comes to the getting started page", () => {
    extension.get_uncaught();
    cy.gettingstartedpagelanding();
});
Then("user redirects to the installation success page", () => {
    extension.get_redirected();
})
Then("user should see the extension success message", () => {
    extension.successmessage();
})
Then("user can go to their dashboard", () => {
    extension.redirect_dashboard();
})