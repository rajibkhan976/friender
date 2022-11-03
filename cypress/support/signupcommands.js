import register from "../pages/signuppage.spec"
// import { faker } from '@faker-js/faker';




import {Utility} from "./utility";
const email = new Utility().getemail()

let values;
beforeEach(() => {

    cy.fixture("devcred").then((data) => {
            values = data;

        })
})  


Cypress.Commands.add('signupvalid', () => {

    register.get_signuppage();
    register.get_emailfield().type(email);
    register.get_fullname().type(values.fullname)
    cy.wait(3000)

});
Cypress.Commands.add('signupclcik', () => {
    register.get_signupbuttonclick().click();

});
Cypress.Commands.add('termsandonditionclcik', () => {
    register.get_termsandcondition().click();
    cy.wait(5000)

});
Cypress.Commands.add('invalidemailcheck', () => {
    register.get_signuppage();
    register.get_emailfield().type(values.invalidEmail);


});

Cypress.Commands.add('signupnotvisible', () => {
    register.get_signupbuttonclick().should('be.disabled');

});
Cypress.Commands.add('errormsgvisible', () => {
    cy.wait(7000);
    register.get_errormsg().contains("Email already exist, please try with a diffrent email!").should("be.visible");

});