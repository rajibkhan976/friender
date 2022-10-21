
import login from "../e2e/POM/login.spec"


let values;
beforeEach(() => {

    cy.fixture("devcred").then((data) => {

        values = data;

    })

})

Cypress.Commands.add('loginvalid', () => {

    login.get_loginbuttonclick().click();
    login.get_emailfield().type(values.email);
    login.get_password().type(values.defaultPass)


});
Cypress.Commands.add('continuebuttonclick', () => {
    login.get_continuebuttonclick().click();

});

Cypress.Commands.add('invalidemailcheck', () => {
    login.get_emailfield().type(values.wrongemail);
    login.get_password().type(values.defaultPass)
    

});

Cypress.Commands.add('remembermecheck', () => {
    login.get_remeberbuttonclick().click()

});
Cypress.Commands.add('invalidpasswordcheck', () => {
    login.get_emailfield().type(values.defaultPass);
    

});

Cypress.Commands.add('invalidpasswordcheck', () => {
    login.get_emailfield().type(values.email);
    login.get_password().type(values.wrongpass)
    

});








