Feature: Sign Up

    User should sign up  successfully
    
    Scenario: user should get the successfull signup email from friender team
        
        Given I entered to the web portal
        When  I entered my valid Email-id and my full name
        Then  I accept the terms and conditions
        Then  I click on sign Up button
        Then  I should see the confirmation popup of sending mail from friender team

    Scenario: user should not be able to signup for giving same registered email-id
        
        Given I enter to the web portal
        When  I entered the same registered email
        Then  I should see the validation message for duplicate user
    Scenario: user should not be able to signup for giving invalid email
        
        Given I enter again to the web portal
        When  I entered the invalid email 
        Then  I should see the email validation message
    Scenario: user won't be able to proceed without accepting friender's terms and condition
        
        Given user enter to the web portal
        When  I entered a valid email and my full name
        Then  I click on Sign Up button