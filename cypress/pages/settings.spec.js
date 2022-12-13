class setting {
    constructor() {
        this.togglebutton = ":nth-child(1) > .setting-child > .switch > .slider";
        this.togglerefriend = "#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div > label > span";
        this.refriendinput = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > input"
        this.removependingreqafter = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div:nth-child(2) > input";
        this.resendfriendreqafter = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div:nth-child(3) > input"
        this.removesendfriendreqafter = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(5) > div.setting-child.others > input"
        this.selectmessagesentfter = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > input"
        this.saveele = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(2) > div > label > span";
        this.unfriendbutton = "#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(1) > div.modal-background > div > div > div.modal-buttons.d-flex.justifyContent-end > button.btn-primary.outline"
        this.mysettingbutton = "#root > main > div > div.body-content-wraper > aside > div > nav.nav-bar.bottom-nav-only.m-top-a.closed-only > ul > li > a"
        this.refriendinginput = "#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > input:nth-child(1)"
        this.refriendingselect1 = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > select"
        this.refriendingselect2 = "#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > input:nth-child(3)"
        this.canceltoggle = ":nth-child(5) > .setting-child > .switch > .slider"
        this.cancelinput = "#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(5) > div.setting-child.others > input"
        this.friendreqenable = "#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div > label > span"
        this.friendreqselect1 = "#root > main > div > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > select:nth-child(1)"
        this.newfriendreqinput = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > input"
        this.newfriendselect2 = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > select:nth-child(3)"
        this.keepingemptyinput = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(4) > div.setting-child.others > input"
        this.sendmefrbutton = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(2) > div > label > span"
        this.dayselect1 = "#root > main > div.main-wrapper > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(10) > div.setting-child.others > select:nth-child(1)"
        this.dayselect2 = "#root > main > div.main-wrapper > div.body-content-wraper > div > div.main-content-inner.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(10) > div.setting-child.others > select:nth-child(2)"
        this.daybackenabling = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(10) > div.setting-child.first > label > span"
        this.acceptfriendreqinput = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > input"
        this.acceptfriendreqselect = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(6) > div.setting-child.others > select:nth-child(3)"
        this.acceptfriendenable = "#root > main > div > div.body-content-wraper > div > div.d-flex.justifyContent-start.main-mysetting > div.setting-content > div > div:nth-child(7) > div > label > span"
    }
    mysettings() {
        cy.get(this.mysettingbutton).click();
    }
    togglebuttons() {
        return cy.get(this.togglebutton)
    }
    unfriend() {
        return cy.get(this.unfriendbutton);
    }
    togglerefriends() {
        return cy.get(this.togglerefriend)
    }
    refriendering_value() {
        cy.contains("Remove pending friend request after").should("be.visible");
        cy.get(this.refriendinginput).clear().type("7")
        cy.get(this.refriendingselect1).select("Months").should("have.value", "months")
        cy.get(this.refriendingselect2).clear().type("9")
    }
    cancelreq() {
        cy.get(this.canceltoggle).click();
        cy.get(this.cancelinput).clear().type('5')
    }
    newfriendreqenable() {
        cy.get(this.friendreqenable).click();
    }
    newfriendreq() {
        cy.get(this.friendreqselect1).select("Select message").should("have.value", "0")
        cy.get(this.newfriendreqinput).type("4");
        cy.get(this.newfriendselect2).select("months").should("have.value", "months")
    }
    acceptfriendreqenable() {
        cy.get(this.acceptfriendenable).click();
    }
    acceptfriendreq() {
        cy.get(this.acceptfriendreqinput).clear();
        cy.get(this.acceptfriendreqinput).type("9");
        cy.get(this.acceptfriendreqselect).select("Years").should("have.value", "years");
    }
    daybackenable() {
        cy.get(this.daybackenabling).click();
    }
    daybackinput() {
        cy.get(this.dayselect1).select("02:00 AM").should("have.value", "02:00");
        cy.get(this.dayselect2).select("04:00 AM").should("have.value", "04:00");
    }
    sendmefr() {
        cy.get(this.sendmefrbutton).click();
    }
    keepingempty() {
        cy.get(this.keepingemptyinput).clear();
        cy.get(this.togglerefriend).click();
    }
    savedelement() {
        return cy.get(this.saveele);
    }
    uncaught() {
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
    }
}
module.exports = new setting();
