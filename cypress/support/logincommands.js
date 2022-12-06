
import login from "../pages/login.spec"

Cypress.Commands.add('login', () => {
    login.get_loginbuttonclick().click();
});

Cypress.Commands.add('loginvalid', () => {
    cy.fixture("logindata.json").then((data) => {
        values = data;
        cy.visit("/")
        login.get_emailfield().type(values.email);
        login.get_password().type(values.newpassword,{log:false});
    })
});

Cypress.Commands.add('continuebuttonclick', () => {
    cy.contains('Continue').click();
});

Cypress.Commands.add('invalidemailchecking', () => {
    cy.fixture("devcred.json").then((data) => {
        values = data
        login.get_emailfield().type(values.wrongemail);
        login.get_password().type(values.defaultPass,{log:false});
    })
});

Cypress.Commands.add('logout', () => {
    login.get_logout().click();
});

Cypress.Commands.add('loginwithfacebookdata', () => {
    cy.fixture("logindatawithfacebookconnect.json").then((data) => {
        values = data;
        cy.visit("/")
        login.get_emailfield().type(values.email);
        login.get_password().type(values.newpassword,{ log:false });
    })
});

Cypress.Commands.add('logininfacebook', (username, password) => {
    cy.session([username, password], () => {
      cy.visit('www.facebook.com')
      cy.get('[data-testid="royal_email"]').type("bikram.biswas@tier5.in")
      cy.get('[data-testid="royal_pass"]').type("Test@1234",{ log:false })
      cy.url().should('contain', '/login-successful')
    })
  })
