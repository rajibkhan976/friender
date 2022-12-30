import { Given, When, Then, } from "@badeball/cypress-cucumber-preprocessor"
let url
When("I entered my valid Email-id and click on continue button", () => {
        cy.server()
        cy.route({
            method: 'POST',
            url: url
          }).as('forgetpwd');
    cy.forgetpwdvalid()
});

Then("I should see the email sent confirmation message and request response in API", () => {
    cy.contains("Email Sent Successfully!").should('be.visible')
    cy.wait('@forgetpwd').then(xhr => {
        cy.log(xhr.requestBody);
        cy.log(xhr.responseBody);
        expect(xhr.method).to.eq('POST');
      })
});

When("I entered my invalid Email-id and click on continue button", () => {
    cy.forgetpwdinvalid()
});

Then("I should see the email is invalid confirmation message", () => {
    cy.contains("Enter proper email id").should('be.visible')
})

 Given("I have Forget password api", () => {
    cy.readFile('cypress/config/config.json').then((text)=>{
        url='https://'+text.forgetpassword+Cypress.env('api')+'/forget-password'
})
})

Then("I want to check Forget password api is working or not", () => {

    cy.readFile('cypress/config/config.json').then((text)=>{
        cy.request({
            method: 'POST',
            url: url,
        
            body:
            {
                email: 'sangeeta321@gmail.com'
            }
        })
        }).then((response) => {
            expect(response.status).to.eq(200)
    })
    
})


