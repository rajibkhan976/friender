import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"

import resetpwd from "../../pages/reset-password.spec"

const URL = Cypress.env("baseUrl");
Given("I enters to the web portal", () => {
	cy.log("Base URL", URL);
	cy.visit(URL);
});



When("I entered my valid Email-id and my default password sent by friender team", () => {
	resetpwd.loginforfirst()
});



Then("I should see landed up into password reset page", () => {
	cy.contains("Welcome to Friender").should('be.visible')
});
Then("I click on continue", () => {
	cy.continuebuttonclick();

});
Then("I should see the login confirmation message", () => {
	cy.contains("Welcome to Dashboard").should("be.visible");
});
Given("I enter to the portal", () => {
	cy.visit('/')

});
When("I entered a wrong Email-id and default password sent by friender team or vice versa", () => {
	cy.invalidemailchecking();
});
Then("I clicked on continue", () => {
	cy.continuebuttonclick();
});
Then("I should not see the welcome dashboard message", () => {
	cy.contains("Login to continue with your account").should("be.visible");
});
