class register{
constructor(){

    this.loginbutton="#login_link > a";
    this.emailfield="#loginEmail";
    
    this.registerbuttonclick="#postLoginInfo";
    }
    get_loginbutton(){
    
    return cy.get(this.loginbutton);
    }
    
    get_emailfield(){
    
        return cy.get(this.emailfield);
        }
        
        get_password(){
    
            return cy.get(this.passwordfield);
            }
            get_registerbuttonclick(){
    
                return cy.get(this.registerbuttonclick);
                }
    
    }
    
    
    module.exports = new register();
    





