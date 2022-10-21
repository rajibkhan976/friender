import {

    Given,
    When,
    Then,
} from "@badeball/cypress-cucumber-preprocessor"
//Call getBaseUrl() to get environment specific url value
const URL = new Utility().getBaseUrl();
import { Utility } from "../../support/utility";
//let url = Cypress.config().baseUrl;


Given("I entered to the web portal", () => {

    cy.visit(URL);

});

When("I entered my valid Email-id and my full name", () => {

    cy.signupvalid();

});
When("I accept the terms and conditions", () => {

    cy.termsandonditionclcik();

});

Then("I click on sign Up button", () => {

    cy.signupclcik();

});
Then("I should see the confirmation popup of sending mail from friender team", () => {

    cy.contains("An email sent to your registered email id please open it up to activate your account.").should("be.visible");

});

Given("I enter to the web portal", () => {
    cy.visit(URL);

});
When("I entered the same registered email", () => {
    cy.signupvalid();

});
Then("I should see the validation message for duplicate user", () => {
    cy.contains("Email-id is already registered").should("be.visible")
});
Given("I enter again to the web portal", () => {

    cy.visit(URL);

});
When("I entered the invalid email", () => {
    cy.invalidemailcheck();

});
Then("I should see the email validation message", () => {
    cy.contains("Enter proper email id").should("be.visible");
});

Given("user enter to the web portal", () => {

    cy.visit(URL);

});
When("I entered a valid email and my full name", () => {
    cy.signupvalid();

});
Then("I click on Sign Up button", () => {
    cy.signupclcik();
});
Then("I should not see any confirmation message sent by friender team", () => {
    cy.contains("Email sent successfully").should("not.be.visible");
});









