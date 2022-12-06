import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
import resetpwd from "../../pages/reset-password.spec"
import tellmeaboutyourself from "../../pages/tellmeaboutyourself.spec"
const URL = Cypress.env("baseUrl");
let values

Given("I signin newly to Friender", () => {
    cy.log("Base URL", URL);
    cy.visit(URL);
    cy.signupvalid()
    cy.termsandonditionclcik()
    cy.signupclcik()
    cy.backtologin()
});


When("I Logged in with the default password", () => {
    resetpwd.loginforfirst()
    cy.login()
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
        })
    resetpwd.get_resetpasswordpage()
});

Then("I should landed in the reset-password page and can change the password", () => {
    resetpwd.getpassword()
     cy.fixture("logindata").then((data) => {
        values = data;
    resetpwd.get_newpassword().type(values.newpassword)
    resetpwd.confirm_newpassword().type(values.newpassword)
    resetpwd.get_buttonnext().click();
    })
   

})


Then("I should see the reset password confirmation message", () => {
    tellmeaboutyourself.gettellusaboutyourselfpage()
    cy.logout()

})


Then("I can login with this newly changed password", () => {
    cy.loginvalid()
    cy.login()
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
        })
    tellmeaboutyourself.gettellusaboutyourselfpage()
})

Then("I should landed in the reset-password page and give very weak password", () => {
    resetpwd.get_newpassword().type('ghsghgiii00')
    resetpwd.confirm_newpassword().type('ghsghgiii00')
});


Then("I should see error message", () => {
    cy.contains("Must have 8 characters including: A-Z,a-z, @#$ & 0-9").should('be.visible')
    resetpwd.get_buttonnext().should('be.disabled')
});

Then("I should landed in the reset-password page and give password and make empty", () => {
    resetpwd.get_newpassword().type('ghsghgiii00').clear()
    resetpwd.confirm_newpassword().type('ghsghgiii00').clear()
});


Then("I should see error message for invalid input", () => {
    cy.contains("Invalid Password").should('be.visible')
    resetpwd.get_buttonnext().should('be.disabled')

});

Then("I should landed in the reset-password page and I should not able to proceed without changing the password", () => {
    resetpwd.get_buttonnext().should('be.disabled')
});

Then("I should landed in the reset-password page and I should not able to proceed giving different password in different field", () => {
    resetpwd.get_newpassword().type('Fw!hhj78')
    resetpwd.confirm_newpassword().type('Sw!hhj78')
    resetpwd.get_buttonpwdisnotmatched().should('be.disabled')
});
