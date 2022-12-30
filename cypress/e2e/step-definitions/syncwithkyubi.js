import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import { faker } from '@faker-js/faker';
import login from "../../pages/login.spec"
const email = "test"+faker.internet.email()
const pwd = 123456
Given("User created via Kyubi", () => {
    cy.request({
        method: 'POST',
        url: 'https://app.kyubi.io/api/external/create-extension-user',
        form: true,
        body:
        {
            token: '5e82703c568e944b9d22417d',
            email: email,
            first_name: 'user 5',
            last_name: 'new',
            phone_number: '2015466542',
            extensionToken: '6373746683a79e7ba7e882af',
            plan: 2
        }

    }).then(() => {
        cy.writeFile('cypress/fixtures/kyubicreds.json', { "email": email, "password": pwd })
    })
});

Then("I can login with the user created via Kyubi and default password of Kyubi", () => {
    cy.visit('/')
    cy.fixture("kyubicreds.json").then((data) => {
        values = data;
        login.get_emailfield().type(values.email);
        login.get_password().type(values.password, { log: false });
        cy.continuebuttonclick()
    })
});
