import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
const URL = Cypress.env("baseUrl");
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
	cy.termsandonditionclcik();
	cy.signupclcik();
});
Then("I should see the validation message for duplicate user", () => {
	cy.errormsgvisible();
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
	cy.signupnotvisible();
});