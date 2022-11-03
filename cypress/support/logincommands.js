import login from "../pages/login.spec"


let values;
beforeEach(() => {

    cy.fixture("devcred").then((data) => {
            values = data;

        })
})  

Cypress.Commands.add('login', () => {


    login.get_loginbuttonclick().click();
    cy.visit("http://localhost:3000");

});


Cypress.Commands.add('loginvalid', () => {


    login.get_emailfield().type(values.email);
    login.get_password().type(values.defaultPass);
    login.get_viewbutton().click();
});
Cypress.Commands.add('continuebuttonclick', () => {
    cy.contains('Continue').click();

});

Cypress.Commands.add('invalidemailchecking', () => {
    login.get_emailfield().type(values.wrongemail);
    login.get_password().type(values.defaultPass);
});
