class register{
constructor(){

    this.signupbutton=".authpages_footer-text__bcWBO > a";
    this.emailfield=":nth-child(1) > .form-field > .form-control";
    this.fullname=":nth-child(2) > .form-field > .form-control";
    this.termsandcondition=".checkmark"
    this.signupbuttonclick=".btn-primary";
    }
    get_signupbutton(){
    
    return cy.get(this.signupbutton);
    }
    
    get_emailfield(){
    
        return cy.get(this.emailfield);
        }
        
        get_fullname(){
    
            return cy.get(this.fullname);
            }

            get_termsandcondition(){
                return cy.get(this.termsandcondition);
            }
            get_signupbuttonclick(){
    
                return cy.get(this.signupbuttonclick);
                }
    
    }
    
    
    module.exports = new register();
    





