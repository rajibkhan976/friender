import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import { faker } from '@faker-js/faker';
const email = faker.internet.email();
Given("I write the functionality of sign-up api", () => {
    cy.readFile('cypress/config/config.json').then((func) => {
        cy.fixture('signup-api').then(function (regdata) {
            cy.writeFile('cypress/fixtures/signup-api.json', { "email1": email })
            cy.request({
                method: 'POST',
                url: func.signup + Cypress.env('api') + '/register',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "email": regdata.email1,
                }
            }).then((res) => {
                cy.log(JSON.stringify(res));
                expect(res.status).to.eq(200)
                expect(res.body).to.eq("User Created");
            })
        })
    })
})
Then("I need to check the reponse coming properly after signing up", () => {
    cy.log("all the response data are matched");
});
