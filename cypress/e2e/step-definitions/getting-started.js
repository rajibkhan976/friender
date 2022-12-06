import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
const waittime = 5000;
const URL = Cypress.env("baseUrl");
Given("I land on the getting started page", () => {
    cy.log("Base URL", URL);
    cy.visit(URL);
    cy.loginvalid();
    cy.continuebuttonclick();
    cy.wait(waittime);
    cy.gettingstartedpagelanding();
});
Then("I should see the steps below to complete the onboarding process", () => {
    cy.stepstocompletegettingstarted();
});
Given("I am on the getting started page", () => {
    cy.gettingstartedpagelanding();
});
Then("I get the 1st step to install the friender extension", () => {
    cy.firststepInstallingFriender();
});
When("I click on the install now option", () => {
    cy.clickingInstallnow();
});
Then("I should get the status installed", () => {
    //cy.installed();
});
Given("I have come to the getting started page", () => {
    cy.wait(waittime);
    cy.gettingstartedpagelanding();
});
Then("I got my second step to connect my facebook account", () => {
    cy.gotsecondstepconnectingfacebook();
});
When("I click on the connect now button and in browser i am not connected with any facebook account", () => {
    cy.clickingconnectnow();
});
Then("I should see below one banner will open instructing to login to an account in facebook", () => {
    cy.noaccountislogedin();
});
When("I clicked on the button to login with an account in facebook", () => {
    cy.clickingonrefreshiconofthebanner();
});
// Then("I login to my facebook account", () => {
// });
// When("I get back to the getting started page once again", () => {
// });
// Then("I clicked on refresh button", () => {
// });
Then("I should see my current facebook account's username", () => {
    cy.facebookaccountbannerOpen();
});
When("I clicked on the connect button to that account", () => {
    cy.clickingconnect();
});
Then("I should see that connect now turns into connected", () => {
    cy.wait(waittime);
    cy.connected();
});
Given("I am landing the getting started page", () => {
    cy.visit(URL)
    cy.loginvalid();
    cy.continuebuttonclick();
    cy.wait(waittime);
    cy.gettingstartedpagelanding();
});
When("I clicked on the connect now button and it connects to my facebook account", () => {
    cy.clickingInstallnow();
    cy.clickingconnectnow();
});
Then("I should see below one banner with my facebook account's username which is currently logged in", () => {
    cy.clickingonrefreshiconofthebanner();
    cy.facebookaccountbannerOpen();
});
When("I suddenly log out my current facebook account and coming to the previous page click on refresh button", () => {
    cy.wait(waittime)
    cy.clickingonrefreshagain();
    cy.log("logged out from facebook");
});
Then("I should get the error message", () => {
    cy.logoutsuddenly();
});
Given("I came the getting started page", () => {
    // cy.log("Base URL", URL);
    // cy.visit(URL);
    cy.wait(waittime);
    cy.reload();
    cy.loginvalid();
    cy.continuebuttonclick();
    cy.gettingstartedpagelanding();
});
Then("I should get my third step to sync my friend list", () => {
    cy.reload();
    cy.clickingInstallnow();
    cy.clickingconnectnow();
    cy.clickingonrefreshiconofthebanner();
    cy.clickingconnect();
    cy.wait(waittime);
});
When("I click on the sync now button and it syncs my curent facebook friend list which i am logged in currently", () => {
    cy.clickingsyncnow();
    cy.wait(waittime);
});
Then("I can see my total count of facebook friends along with the count of synced friends from facebook", () => {
    cy.totalcountoffriendsandsyncedfriends();
});
Then("I click on the friends menu from left side i can my facebook friendlist", () => {
    cy.visit("http://localhost:3000/friends")
    cy.wait(waittime);
});
Then("I should see all the friends related information", () => {
    cy.columnNamesCheck()
});