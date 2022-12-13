import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import setting from "../../pages/settings.spec"
const URL = Cypress.env("baseUrl");
const waittime = 7000;
Given("I logged in to the friender web portal", () => {
    cy.visit(URL);
    cy.loginwithfacebookdata();
    cy.continuebuttonclick();
    setting.uncaught();
    cy.wait(waittime);
})
When("I should come to the my setting page", () => {
    cy.wait(waittime)
    setting.uncaught();
    setting.mysettings();
})
Then("I can see the header", () => {
    cy.contains("my settings").should("be.visible")
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
})
Given("I should see the required options", () => {
    cy.contains("friend requests").should("be.visible");
})
Then("I click on the toggle buttons if they want to enable those", () => {
    setting.togglebuttons().click();
    // setting.unfriend().contains(" Close").click();
});
Then("I should see the successfully saved settings confirmation popup", () => {
    //  cy.get("#\33 9 > div.Toastify__toast-body > div:nth-child(2) > div > div > div.msg-header.success-header").contains("Congratulations").should("be.visible");
});
Given("I should see the Re-Friending option", () => {
    cy.contains("Re-Friending")
    cy.wait(waittime)
});
When("I enable that button", () => {
    setting.togglerefriends().click();
    cy.wait(waittime)
});
Then("I should give the input time value to Remove pending friend request and select time accordingly", () => {
    setting.uncaught();
    setting.refriendering_value();
    // setting.togglerefriends().click();
    cy.wait(waittime)
});
Given("I should see Cancel Sent Friend Requests option", () => {
    cy.contains("Automaticaly Cancel sent friend requests.").should("be.visible")
});
Then("I should give the input time value to Remove sent friend request and select the time", () => {
    setting.cancelreq();
});
Given("user should see Send message when you receive a new friend request from someone option", () => {
    setting.newfriendreqenable();
    cy.wait(waittime)
    cy.contains("Select the message template you want to send").should("be.visible")
    cy.wait(waittime)
    setting.uncaught();
})
Then("user should can select a message template and provide time and value to send to the new friend", () => {
    setting.newfriendreq();
})
Given("user should see Send message when you accept a friend request you received from someone.", () => {
    setting.acceptfriendreqenable();
    setting.uncaught();
    cy.contains("Send message when you accept a friend request you received from someone.").should("be.visible")
})
Then("user selects a message template and provide time and its value accordingly to send to the new friend", () => {
    setting.acceptfriendreq();
})
Given("user should see Day back to analyse friends engagement option", () => {
    cy.contains("Day back to analyse friends engagement").should("be.visible")
})
Then("user can see Select the time you want to sync. From", () => {
    setting.daybackenable();
    cy.wait(waittime)
})
Then("user can select the to and from time", () => {
    setting.daybackinput();
})
Given("user should make some changes in the page", () => {
    setting.savedelement().click();
    cy.wait(waittime)
})
When("user reloads the page once or login to the same account once again", () => {
    cy.loginwithfacebookdata()
    cy.continuebuttonclick();
    setting.uncaught();
    cy.wait(waittime)
    setting.mysettings();
})
Then("user should see the settings remains the same", () => {
    cy.wait(6000)
    // setting.savedelement().should("be.enabled");
    cy.log("settings should be same")
})
// Given("user sees the Re-Friending option", ()=> {

//     cy.contains("Re-Friending").should("be.visible")
// });
// When("user keeps the input field empty", ()=> {

//     setting.keepingempty();
//     cy.wait(waittime)
//     });
// Then("user clicks on the next  toggle button", ()=> {
//     setting.sendmefr();
//     cy.wait(waittime)
//     cy.contains("Warning").should("be.visible");
//     cy.wait(waittime)
// })