import {Given,When,Then,} from "@badeball/cypress-cucumber-preprocessor"

const URL = new Utility().getBaseUrl();
import {Utility} from "../../support/utility";



Given("I enters to the web portal", () => {

     cy.visit(URL);

});

When("I entered my valid Email-id and my default password sent by friender team", () => {

     cy.loginvalid();

});
Then("I click on continue", () => {

     cy.continuebuttonclick();

});

Then("I should see the login confirmation message", () => {

     cy.contains("Welcome to Dashboard").should("be.visible");

});
Given("I enter to the portal", () => {

     cy.login();

});

When("I entered a wrong emeil id and default password sent by friender team or vice versa", () => {

     cy.invalidemailchecking();

});
Then("I clicked on continue", () => {
     cy.continuebuttonclick();

});

Then("I should not see the welcome dashboard message", () => {

     cy.contains("Login to continue with your account").should("be.visible");

});
