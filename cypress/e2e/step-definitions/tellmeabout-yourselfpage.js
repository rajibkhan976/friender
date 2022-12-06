import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import tellmeaboutyourself from "../../pages/tellmeaboutyourself.spec"
const URL = Cypress.env("baseUrl");

Given("I land on Onboarding page", () => {
	cy.visit(URL)
	cy.createuser()
    cy.loginvalid();
    cy.continuebuttonclick();
	tellmeaboutyourself.gettellusaboutyourselfpage()
});

Then("I will landed up into Tell me about Yourself page and I want to skip That page", () => {
	tellmeaboutyourself.gettellusaboutyourselfpage()
	tellmeaboutyourself.getskipbutton()
	cy.gettingstartedpagelanding()
});

Then("I will lanOnboarding pageded up into Tell me about Yourself page and I want to give answer to all questions", () => {
	tellmeaboutyourself.gettellusaboutyourselfpage()
	tellmeaboutyourself.giveanswertoquestionfirst()
	tellmeaboutyourself.giveanswertoquestionsecond()
	tellmeaboutyourself.giveanswertoquestionthree()
	tellmeaboutyourself.getnextpage()
	cy.gettingstartedpagelanding()
})
