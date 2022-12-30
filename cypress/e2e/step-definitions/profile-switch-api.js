import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
Given("I switch between the synced facebook profiles", () => {
  cy.readFile('cypress/config/config.json').then((data) => {
    cy.request({
      method: 'POST',
      url: data.fetchUserFriendlist + Cypress.env('api') + '/fetch-user-friendlist',
      headers: {
        'Authorization': data.token,
        'Content-Type': 'application/json'
      },
      body: {
        "fbUserId": "100081536522237"
      }
    }).then((res) => {
      cy.fixture('login-api').then((payload) => {
        cy.log(JSON.stringify(res));
        cy.log(res.body.friend_details)
        cy.log(res.body.data)
        expect(res.status).to.eq(payload.status);
        expect(res.body.message).to.eq(payload.message1);
      })
    })
  })
});
Then("I get the response properly according to the switched profile", () => {
  cy.log("api is hitting and response coming properly with 200 ok")
})
