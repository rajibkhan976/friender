Feature: Reset Password

    User should be able to reset password for first time login

    Scenario: user should not be able to make weak password

        Given User created via Kyubi
        When  I can login with the user created via Kyubi and default password of Kyubi
        Then  I should landed in the reset-password page and give very weak password
        Then  I should see error message

    Scenario: user should not be able to proceed keeping empty the field

        Given I Logged in with the default password
        Then  I should landed in the reset-password page and give password and make empty
        Then  I should see error message for invalid input

    Scenario: user cannot skip without changing the password
        
        Given I Logged in with the default password
        Then  I should landed in the reset-password page and I should not able to proceed without changing the password
    
    Scenario: user should not be able to proceed with giving different password in the both 'Set new Password' and 'Confirm new password'
        
        Given I Logged in with the default password
        Then  I should landed in the reset-password page and I should not able to proceed giving different password in different field

    Scenario: user should be logged in successfully with new password

        Given  I Logged in with the default password
        Then  I should landed in the reset-password page and can change the password
        Then  I should see the reset password confirmation message
        Then  I can login with this newly changed password