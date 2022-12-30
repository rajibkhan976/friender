import { toast } from "react-toastify";
class setting {
    constructor() {
        this.togglebutton = "span.slider.round";
        this.getsetting = 'div.settings'
        this.getinput='div.setting-child.others'
        this.inputbox = ' input.setting-input'
        this.selectbox = ' span.select-wrapers > select.selector_box'
        this.mysettingbutton = "#root > main > div > div.body-content-wraper > aside > div > nav.nav-bar.bottom-nav-only.m-top-a.closed-only > ul > li > a"
        this.toaster = 'div.Toastify__toast-body'
    }
    mysettings() {
        cy.get(this.mysettingbutton).click();
    }
    togglebuttons() {
        return cy.get(this.getsetting).contains("Don’t send friend requests to people I’ve been friends with before.").within(()=>{
            cy.get(this.togglebutton).click().should('have.css', 'background-color', 'rgba(58, 151, 76, 0.2)')

        })
    }
    unfriend() {
        return cy.get(this.unfriendbutton);
    }
    togglerefriends() {
        return cy.get(this.getsetting).contains("Re-Friend").within(()=>{
            cy.get(this.togglebutton).click().should('have.css', 'background-color', 'rgba(58, 151, 76, 0.2)')
        }
        )
    }
    refriendering_value() {
        cy.contains("Remove pending friend request after ").should('be.visible')
        .within(()=> {
            cy.get(this.inputbox+':nth-child(1)').clear()
            cy.get(this.inputbox+':nth-child(3)').clear()
        })
        this.getwarningtoaster()
        cy.contains("Remove pending friend request after ").should('be.visible')
        .within(()=>{
            cy.get(this.inputbox+':nth-child(1)').clear().type("7")
            cy.get(this.selectbox).select("Months").should("have.value", "months")
            cy.get(this.inputbox+':nth-child(3)').clear().type("9")
        })
    }
    cancelreq() {
        cy.get(this.getsetting).contains("Automaticaly Cancel sent friend requests.").within(()=>{
            cy.get(this.togglebutton).click().should('have.css', 'background-color', 'rgba(58, 151, 76, 0.2)')  
        })   
    }
    getwarningtoaster()
    {
        cy.get(this.toaster).should('be.visible').should('have.text','Warning!Input should not be empty or 0')
    }
    cancelrequestafterdays()
    {
        cy.contains("Remove sent friend request after ").should('be.visible').within(()=> {
            cy.get(this.inputbox).clear()
        })
        this.getwarningtoaster()
        cy.contains("Remove sent friend request after ").should('be.visible').within(()=> {
            cy.get(this.inputbox).type("7")
        })
    }
    newfriendreqenable() {
        cy.get(this.getsetting).contains("Send message when you receive a new friend request from someone.").within(()=>{
            cy.get(this.togglebutton).click().should('have.css', 'background-color', 'rgba(58, 151, 76, 0.2)')  
        }) 
    }
    newfriendreq() {
        cy.contains("Select the message template you want to send").should('be.visible')
        .within(()=> {
            cy.get(this.selectbox).first().select("Select message").should("have.value", "0")
            cy.get(this.inputbox).clear()
            cy.get(this.inputbox).clear()
        })
        this.getwarningtoaster()
        cy.contains("Select the message template you want to send").should('be.visible')
        .within(()=> {
            cy.get(this.selectbox).first().select("Select message").should("have.value", "0")
            cy.get(this.inputbox).clear().type("5")
            cy.get(this.inputbox).type("4");
            cy.get(this.selectbox).eq(1).select("months").should("have.value", "months")
        })
    }
    acceptfriendreqenable() {
        cy.get(this.getsetting).contains("Send message when you accept a friend request you received from someone.").should('be.visible')
        .within(()=>{
            cy.get(this.togglebutton).click().should('have.css', 'background-color', 'rgba(58, 151, 76, 0.2)')  
        })
    }
    acceptfriendreq() {
        cy.contains("Select the message tempalte you want to send").should('be.visible')
        .within(()=> {
            cy.get(this.inputbox).clear()
            cy.get(this.inputbox).clear()
        })
        this.getwarningtoaster()
        cy.contains("Select the message tempalte you want to send").should('be.visible')
        .within(()=> {
            cy.get(this.inputbox).clear();
            cy.get(this.inputbox).type("9")
            cy.get(this.selectbox).eq(1).select("Years").should("have.value", "years");
        })
    }
    daybackenable() {
        cy.get(this.getsetting).contains("Friend list and engagement sync time").should('be.visible')
        .within(()=>{
            cy.get(this.togglebutton).click().should('have.css', 'background-color', 'rgba(58, 151, 76, 0.2)')  
        })
    }
    daybackinput() {
        cy.contains("Select the time: From ").should('be.visible')
        .within(()=> {
        cy.get(this.selectbox).eq(0).select("02:00 AM").should("have.value", "02:00");
        cy.get(this.selectbox).eq(1).select("04:00 AM").should("have.value", "04:00");
        })
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
    receivedfriend()
    {
        cy.get(this.getsetting).contains("Send message when you receive a new friend request from someone.").should('be.visible')
        .within(()=>{
            cy.get(this.togglebutton).click().should('have.css', 'background-color', 'rgba(58, 151, 76, 0.2)')  
        }) 
    }
    selectmsgforreceivedfriendreq()
    {
        cy.contains("Select the message template you want to send").should('be.visible')
        .within(()=> {
            cy.get(this.selectbox).eq(0)
        })
    }
    selecttimeforsendmessage()
    {
        cy.contains("Select the message template you want to send").should('be.visible')
        .within(()=> {
            cy.get(this.inputbox).clear().type(5)
            cy.get(this.selectbox).eq(1).select("Months")
        })
    }
    declinerequest()
    {
        cy.get(this.getsetting).contains("Send message when you decline a friend request you received from someone.").should('be.visible')
        .within(()=>{
            cy.get(this.togglebutton).click().should('have.css', 'background-color', 'rgba(58, 151, 76, 0.2)')  
        })
    }
    selectmsgtemplatetodeclinedrequest()
    {
        cy.contains("Select the message tempalte you want to send ").should('be.visible')
        .within(()=> {
            cy.get(this.selectbox).eq(0)
    })
    }
    uncaught() {
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
    }
}
module.exports = new setting();
