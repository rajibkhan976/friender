import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"

When("I entered my valid Email-id and click on continue button", () => {
    cy.forgetpwdvalid()
});

Then("I should see the email sent confirmation message", () => {
    cy.contains("Email Sent Successfully!").should('be.visible')
});

When("I entered my invalid Email-id and click on continue button", () => {
    cy.forgetpwdinvalid()
});

Then("I should see the email is invalid confirmation message", () => {
    cy.contains("Enter proper email id").should('be.visible')
})