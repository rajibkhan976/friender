class getstarted {
    constructor() {
        this.installnow = ".step-action";
        this.installed = "#root > main > div > div.body-content-wraper > div > div > div.steps-wraper > div.ind-steps.d-flex.activated > span.step-action",
            this.connectnow = ":nth-child(2) > .step-action";
        this.gotoyourfacebook = "#root > main > div > div.body-content-wraper > div > div > div.steps-wraper > div.fb-connection-rules > div > div > div > button.fb-connect-btn > img";
        this.connectbutton = ".fb-connect-btn";
        this.connected = ":nth-child(2) > .step-action"
        this.refresh = ".fb-reset-btn";
        this.sync = ".step-action";
        this.refreshagain = "#root > main > div > div.body-content-wraper > div > div > div.steps-wraper > div.fb-connection-rules > div > div.fb-account-connect > div.fb-connect-btn-wraper > button.fb-reset-btn"
        this.profbutton = ".profiles-informations"
        this.totalfriend = ".nav-bar > ul > li:nth-child(4)"
        this.profile = '.profile-photo'
        this.pfswitch = "#root > main > div.main-wrapper > div.body-content-wraper > aside > div > div.profile-popup > div.profile-listings-sec-wraper > div.profile-option-listings > ul > li > span > span > img"
    }
    get_installfriender() {
        return cy.get(this.installnow);
    }
    get_installed() {
        return cy.get(this.installed);
    }
    get_gotoyourfacebook() {
        return cy.get(this.gotoyourfacebook);
    }
    get_connectfacebook() {
        return cy.get(this.connectnow);
    }
    get_connectfacebookprofile() {
        return cy.get(this.connectbutton);
    }
    get_reloadbutton() {
        return cy.get(this.refresh);
    }
    get_reloadagain() {
        return cy.get(this.refreshagain);
    }
    get_connected() {
        return cy.get(this.connected);
    }
    get_syncnowbutton() {
        return cy.get(this.sync);
    }
    get_leftsidemenu() {
        return cy.get(this.leftmenu);
    }
    get_checkstepstatus() {
        cy.contains("Installed").should("be.visible");
        cy.contains("Connected").should("be.visible");
        cy.contains("Synced").should("be.visible");
    }
    get_congratulation() {
        cy.contains("Congratulations!").should("be.visible")
    }
    uncaught() {
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
    }
    get_clcikonprofile() {
        cy.get(this.profile).click();
    }
    get_checkfriendcount() {
        cy.contains("Total Friends").should("be.visible");
        cy.fixture("facebook-creds").then((data) => {
            let value = data;
            if (cy.get(this.profbutton).contains(value.profilename2)) {
                cy.get(this.totalfriend).click().contains(value.QASwagata).should("be.visible")
                cy.log("total friends got synced properly");
            }
            cy.get(this.pfswitch).click();
            if (cy.get(this.profbutton).contains(value.profilename1)) {
                cy.get(this.totalfriend).click().contains(value.QAbikram).should("be.visible")
                cy.log("total friends of this profile got synced properly");
            }
        })
    }
}
module.exports = new getstarted();
