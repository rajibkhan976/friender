
import register from "../e2e/POM/signuppage.spec"


let values;
beforeEach(() => {

    cy.fixture("devcred").then((data) => {

        values = data;

    })

})

Cypress.Commands.add('signupvalid', () => {

    register.get_signupbutton().click();
    register.get_emailfield().type(values.email);
    register.get_fullname().type(values.fullname)

});
Cypress.Commands.add('signupclcik', () => {
    register.get_signupbuttonclick().click();

});
Cypress.Commands.add('termsandonditionclcik', () => {
    register.get_termsandcondition().click();

});
Cypress.Commands.add('invalidemailcheck', () => {
    register.get_signupbutton().click();
    register.get_emailfield().type(values.invalidEmail);


});




