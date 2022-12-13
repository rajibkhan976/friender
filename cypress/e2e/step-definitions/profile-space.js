import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import profile from "../../pages/profile-space.spec"
const waittime = 7000;
const URL = Cypress.env("baseUrl");
Given("I have logged in to the friender web portal", () => {
	cy.log("Base URL", URL);
	cy.visit(URL);
	cy.loginwithfacebookdata();
  cy.continuebuttonclick();
	cy.wait(waittime);
	profile.uncaught();
	cy.gettingstartedpagelanding();
});
When("I should open the profile space", () => {
	cy.contains("Installed").should("be.visible");
	cy.contains("Connected").should("be.visible");
	cy.contains("Synced").should("be.visible");
	cy.contains("Congratulations!").should("be.visible")
  profile.get_pf();
});
Then("I can see the account i am logged in in facebook", () => {
	profile.profile_matching();
	profile.get_emailmatch();
});
Given("I am on the getting-started page", () => {
	cy.contains("Getting Started").should("be.visible");
});
When("I logged in to the another facebook profile", () => {
	cy.wait(waittime)
	cy.log("manually log in to another facebook profile");
});
Then("I can see that facebook profile is showing in the list", () => {
	profile.get_secondpf().should("be.visible")
	cy.wait(waittime)
	profile.get_secondpf().click();
	cy.wait(waittime)
  cy.loginwithfacebookdata();
	cy.continuebuttonclick();
	profile.get_pf();
});
Then("I switch to that profile and the profile name is showing as deafult logged in profile", () => {
	profile.second_pfmatch();
	cy.wait(waittime)
});
Given("I open the profile space", () => {
	cy.contains("Getting Started").should("be.visible")
	profile.name_matching();
	Cypress.on('uncaught:exception', (err, runnable) => {
		return false
	})
});
When("I switch to any of the existing profiles", () => {
	profile.profile_swich();
	cy.loginwithfacebookdata();
	cy.continuebuttonclick();
	
});
Then("I go to my friend list page", () => {
	profile.get_friendlist().click();
})
Then("I can see my total number of friends is matched according to my profile friends", () => {
	profile.get_friendlist();
	profile.get_friendheader();
	profile.get_pf();
	profile.pfmatch_friends1st();
});
