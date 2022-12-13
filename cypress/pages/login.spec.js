class login {
    constructor() {
        this.emailfield = "input[type=email]";
        this.password = ":nth-child(2) > .form-field > .form-control";
        this.loginbuttonclick = ".btn-primary";
        this.view = ".show-hide";
        this.getbottomsidebar = ".sidebar-opened-wraper "
    }
    get_emailfield() {
        return cy.get(this.emailfield);
    }
    get_password() {
        return cy.get(this.password);
    }
    get_loginbuttonclick() {
        return cy.get(this.loginbuttonclick).contains("Continue");
    }
    get_viewbutton() {
        return cy.get(this.view);
    }
    get_logout() {
        return cy.get(this.getbottomsidebar).get(" .bottom-nav-bar > li:nth-child(3) > button.btn-transparent")
    }
}
module.exports = new login();
