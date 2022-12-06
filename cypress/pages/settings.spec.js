class setting {
    constructor() {
        this.togglebutton = ":nth-child(1) > .setting-child > .switch > .slider";
        this.togglerefriend ="#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div > label > span";
        this.refriendinput = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > input"
        this.removependingreqafter = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div:nth-child(2) > input";
        this.resendfriendreqafter = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div:nth-child(3) > input"
        this.removesendfriendreqafter = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(5) > div.setting-child.others > input"
        this.selectmessagesentfter = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > input"
        this.saveele="#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(2) > div > label > span";
        this.unfriendbutton="#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(1) > div.modal-background > div > div > div.modal-buttons.d-flex.justifyContent-end > button.btn-primary.outline"  
    }
        mysettings(){
        cy.get("#root > main > div > div.body-content-wraper > aside > div > nav.nav-bar.bottom-nav-only.m-top-a.closed-only > ul > li > a").click();
    }
    togglebuttons() {
    return cy.get(this.togglebutton)
    }
    unfriend(){
    return cy.get(this.unfriendbutton);
    }
    togglerefriends() {
    return cy.get(this.togglerefriend)
    }
    refriendering_value() {
        cy.contains("Remove pending friend request after").should("be.visible");
        cy.get("#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > input:nth-child(1)").clear().type("7")
        cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > select").select("Months").should("have.value", "months")
        cy.get("#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > input:nth-child(3)").clear().type("9")
    }
    cancelreq() {
        cy.get(":nth-child(5) > .setting-child > .switch > .slider").click();
        cy.get("#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(5) > div.setting-child.others > input").clear().type('5')
    }
    newfriendreqenable() {
        cy.get("#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div > label > span").click();
    }
    newfriendreq() {
        cy.get("#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > select:nth-child(1)").select("Select message").should("have.value", "0")
        cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > input").type("4");
        cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > select:nth-child(3)").select("months").should("have.value", "months")
    }
    acceptfriendreqenable() {
        cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(7) > div > label > span").click();
    }
    acceptfriendreq() {
        cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > input").clear();
        cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > input").type("9");
        cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > select:nth-child(3)").select("Years").should("have.value", "years");
    }
    daybackenable() {
    cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(10) > div.setting-child.first > label > span").click();
    }
    daybackinput() {
        cy.get("#root > main > div.main-wrapper > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(10) > div.setting-child.others > select:nth-child(1)").select("02:00 AM").should("have.value", "02:00");
        cy.get("#root > main > div.main-wrapper > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(10) > div.setting-child.others > select:nth-child(2)").select("04:00 AM").should("have.value", "04:00");
    }
    sendmefr() {
    cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(2) > div > label > span").click();
    }
    keepingempty() {
        cy.get("#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > input").clear();
        cy.get(this.togglerefriend).click();
    }
    savedelement(){
    return cy.get(this.saveele);
    }
    uncaught(){
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
    })
    }
    }
module.exports = new setting();