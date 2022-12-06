import register from "../pages/signuppage.spec"
import { faker } from '@faker-js/faker';
const defaultPass = "Tier5"
var email = faker.internet.email()


Cypress.Commands.add('signupvalid', () => {
    register.get_signuppage();
    cy.writeFile("cypress/fixtures/signupdata.json",{"email":email,"name":name})
    cy.fixture("signupdata.json").then((testdata) => {
        console.log(testdata)
        email=testdata.email
        console.log(email)
        register.get_emailfield().clear().type(email)
        cy.writeFile("cypress/fixtures/signeddata.json",{email,defaultPass})
    })
})

Cypress.Commands.add('signupclcik', () => {
    register.get_signupbuttonclick().click();
});

Cypress.Commands.add('termsandonditionclcik', () => {
    register.get_termsandcondition().click();
});

Cypress.Commands.add('invalidemailcheck', () => {
    register.get_signuppage();
    cy.fixture("devcred").then((data) => {
        values = data;
        register.get_emailfield().type(values.invalidEmail);
    })
});

Cypress.Commands.add('signupnotvisible', () => {
    register.get_signupbuttonclick().should('be.disabled');
});
Cypress.Commands.add('errormsgvisible', () => {
    register.get_errormsg().contains("Email already exist, please try with a diffrent email!").should("be.visible");

});

Cypress.Commands.add('backtologin', () => {
    register.get_backtologin().contains('Back to Login').click()
})

Cypress.Commands.add('checkuser', () => {
    cy.get(register.get_errormsg()).then
})



