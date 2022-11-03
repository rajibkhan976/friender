class login {
    constructor() {
        this.emailfield = "input[type=email]";
        this.password = ":nth-child(2) > .form-field > .form-control";
        this.loginbuttonclick = ".btn-primary";
        this.view=".show-hide";
    }
    get_emailfield() {

        return cy.get(this.emailfield);
    }

    get_password() {

        return cy.get(this.password);
    }

    get_loginbuttonclick() {

        return cy.get(this.loginbuttonclick);
    }
    get_viewbutton() {

        return cy.get(this.view);
    }




}


module.exports = new login();