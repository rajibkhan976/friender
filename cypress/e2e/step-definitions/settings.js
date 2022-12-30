import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import setting from "../../pages/settings.spec"
const waittime = 7000;

Given("I logged in to the friender web portal", () => {
    cy.loginwithfacebookdata();
    cy.continuebuttonclick();
    setting.uncaught();
    cy.wait(waittime);
 
})
When("I should come to the my setting page", () => {
    cy.readFile('cypress/config/config.json').then((text)=>{
        cy.server()
        cy.route({
            method: 'POST',
            url: 'https://'+text.fetchUsersettings+Cypress.env('api')+'/fetch-user-profile-settings'
          }).as('settings');
      })
    setting.mysettings();
})

Then("I can see the header and check the response of API", () => {

    cy.contains("my settings").should("be.visible")
    cy.wait('@settings').then(xhr => {
        cy.log(xhr.requestBody);
        cy.log(xhr.responseBody);
        expect(xhr.method).to.eq('POST');
    })
})
Given("I should see the required options", () => {
    cy.contains("friend requests").should("be.visible");
})
Then("I click on the toggle buttons if they want to enable those", () => {
    setting.togglebuttons().click();
});
Then("I should see the successfully saved settings confirmation popup", () => {
    //  cy.get("#\33 9 > div.Toastify__toast-body > div:nth-child(2) > div > div > div.msg-header.success-header").contains("Congratulations").should("be.visible");
});
Given("I should see the Re-Friending option", () => {
    cy.contains("Re-Friending")
});
When("I enable that button", () => {
    setting.togglerefriends()
    cy.wait(waittime)
});
Then("I should give the input time value to Remove pending friend request and select time accordingly", () => {
    setting.uncaught();
    setting.refriendering_value();
});
Given("I should see Cancel Sent Friend Requests option", () => {
    cy.contains("Automaticaly Cancel sent friend requests.").should("be.visible")
});
Then("I should give the input time value to Remove sent friend request and select the time", () => {
    setting.cancelreq();
    setting.cancelrequestafterdays();
});
Given("user should see Send message when you receive a new friend request from someone option", () => {
    setting.newfriendreqenable();
    cy.contains("Select the message template you want to send").should("be.visible")
})
Then("user should can select a message template and provide time and value to send to the new friend", () => {
    setting.newfriendreq();
})
Given("user should see Send message when you accept a friend request you received from someone.", () => {
    setting.acceptfriendreqenable();
    cy.contains("Send message when you accept a friend request you received from someone.").should("be.visible")
})
Then("user selects a message template and provide time and its value accordingly to send to the new friend", () => {
    setting.acceptfriendreq();
})
Given("user should see Day back to analyse friends engagement option", () => {
    cy.contains("Day back to analyse friends engagement").scrollIntoView().should("be.visible")
})
Then("user can see Select the time you want to sync. From", () => {
    setting.daybackenable();
})
Then("user can select the to and from time", () => {
    setting.daybackinput();
})
Given("user should make some changes in the page", () => {
    setting.savedelement().click();
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
    cy.log("settings should be same")
})
Given("user should see Send message when you decline a friend request you received from someone option", () => {
    setting.receivedfriend()
})

Then("user select a message template to send to the new friend", () => {
    setting.selectmsgforreceivedfriendreq()
})

Then("user give the input time value to send the message", () => {
    setting.selecttimeforsendmessage()
})
Given("user should see Send message when I decline the request", () => {
  setting.declinerequest()
})

Then("user can select a message template to send to the people decline the request", () => {
    setting.selectmsgtemplatetodeclinedrequest()
})

Then("user can give the input time value to send the message to the people decline the request", () => {
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