class profile {
    constructor() {
        this.pf = '.profile-photo'
        this.anotherfb = ".sub-profiles > span > img"
        this.pfbutton = ".profiles-informations"
        this.swagswitch = "div.profile-option-listings > ul > li"
        this.friendlistbutton = "#root > main > div.main-wrapper > div.body-content-wraper > aside > div > nav:nth-child(2) > ul > li.nav-menu.has-child > a"
        this.friendlistheader = ".header-breadcrumb > .d-flex";
        this.headcount =".num-header-count";
    }
    get_pf() {
        return cy.get(this.pf).click();
    }
    get_secondpf() {
        return cy.get(this.swagswitch+'[data-tooltip="Bikram Biswas QA"]')
    }
    uncaught() {
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
    }
    get_emailmatch() {
        cy.fixture("logindatawithfacebookconnect").then((data) => {
            let value = data;
            if (cy.get(this.pfbutton).contains(value.email)) {
                cy.log("matched friender account");
            }
        })
    }
    profile_matching() {
        cy.fixture("facebook-creds").then((data) => {
            let value = data;
            if (cy.get(this.pfbutton).contains(value.profilename2)) {
                cy.log("matched logged in account");
            }
        })
    }
    second_pfmatch() {
        cy.fixture("facebook-creds").then((data) => {
            let values = data;
            if (cy.get(this.pfbutton).contains(values.profilename1)) {
                cy.log("matched logged in account");
            }
        })
    }
    pfmatch_friends1st() {
        cy.wait(3000)
        cy.fixture("facebook-creds").then((data) => {
            let val = data;
            if (cy.get(this.pfbutton).contains(val.profilename2)) {
                cy.get(".num-header-count").contains(val.QASwagata).should("be.visible")
                cy.wait(5000)
                cy.log("327 friends of that profile should be visible");
                Cypress.on('uncaught:exception', (err, runnable) => {
                    return false
                })
            }
            else {
                cy.log("another profile linked")
            }
            cy.wait(4000)
            cy.get(this.anotherfb).click();
            cy.get(this.pf).click();
            if (cy.get(this.pfbutton).contains(val.profilename1)) {
                cy.log("profile QA bikram");
                cy.get(this.friendlistbutton).click();
                cy.get(this.headcount).contains(val.QAbikram).should("be.visible")
                cy.log("40 friends of QA bikram profile should be shown")
                Cypress.on('uncaught:exception', (err, runnable) => {
                    return false
                })
            } else {
                cy.log("diffrent profile linked")
            }
        })
    }
    name_matching() {
        cy.fixture("facebook-creds").then((data) => {
            let keys = data
            cy.get(this.pfbutton).contains(keys.profilename1).should("be.visible")
        })
    }
    profile_swich() {
        return cy.get(this.swagswitch).click({multiple: true});
    }
    get_friendlist() {
        return cy.get(this.friendlistbutton).click();
    }
    get_friendheader() {
        return cy.get(this.friendlistheader).contains("friend list").should("be.visible");
    }
}
module.exports = new profile();
