import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
Given("I write the functionality of login api", () => {
  let identity
  cy.readFile('cypress/config/config.json').then((func) => {
    cy.fixture('login-api').then((payload) => {
      cy.request({
        method: 'POST',
        url: func.login + Cypress.env('api') + '/login',
        headers: {
         // 'Authorization': 'Bearer' + payload.token,
          'Content-Type': 'application/json'
        },
        body: {
          "email": "sss@gmail.com",
          "password": "Sangeeta@321"
        }
    }).then((res) => {
      cy.log(JSON.stringify(res));
      expect(res.status).to.eq(payload.status)
      expect(res.body.email).to.eq(payload.email);
      expect(res.body.user_id).to.eq(payload.user_id);
      expect(res.body.message).to.eq(payload.message);
    })
  })
})
})

Then("I check the reponse coming properly", () => {
  cy.log("all the response data are matched")
})
