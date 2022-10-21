class login{
    constructor(){
        this.emailfield=":nth-child(1) > .form-field > .form-control";
        this.password=":nth-child(2) > .form-field > .form-control";
        this.loginbuttonclick=".btn-primary";
        this.remeber=".remember-wraper"
        this.continue=""
        }
        get_emailfield(){
        
            return cy.get(this.emailfield);
            }
            
            get_password(){
        
                return cy.get(this.password);
                } 

                get_loginbuttonclick(){
        
                    return cy.get(this.loginbuttonclick);
                    }
                    get_remeberbuttonclick(){
        
                        return cy.get(this.remeber);
                        }
                        get_continuebuttonclick(){
        
                            return cy.get(this.continue);
                            }
                
            
        
        }
        
        
        module.exports = new login();
    