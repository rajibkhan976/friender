import {

     Given,
     When,
     Then,
} from "@badeball/cypress-cucumber-preprocessor"
//Call getBaseUrl() to get environment specific url value
const URL = new Utility().getBaseUrl();
import { Utility } from "../../support/utility";
//let url = Cypress.config().baseUrl;


Given("I enters to the web portal", () => {

     cy.visit(URL);

});

When("I entered my valid Email-id and my default password sent by friender team", () => {

     cy.loginvalid();
     cy.continuebuttonclick();

});
Then("I click on continue", () => {

     cy.continuebuttonclick();

});

Then("I should see the login confirmation message", () => {

     cy.contains("login successful").should("be.visible");

});
