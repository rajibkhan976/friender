class extension {
    constructor() {
        this.dashboard = "div.body-content-wraper > div > header > a"
    }
    get_redirected() {
        if (cy.contains("Installed").should("be.visible")) {
            Cypress.on('uncaught:exception', (err, runnable) => {
                return false
            })
            cy.visit("/extension.success")
            cy.wait(4000)
        }
        else {
            cy.log("go to diffetent page")
        }
    }
    get_uncaught() {
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
    }
    successmessage() {
        cy.contains("Congratulations! Friender Successfully Installed.").should("be.visible");
        cy.contains("You're seeing this page because you have successfully installed Fiender extension in your browser.");
    }
    redirect_dashboard() {
        cy.get(this.dashboard).contains("Dashboard").click();
    }
}
module.exports = new extension();
