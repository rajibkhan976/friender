Feature: Forget password

    User should change password if we forget password


    Scenario: user should be able to renew the password

        Given I enters to the web portal
        When  I entered my valid Email-id and click on continue button
        Then  I should see the email sent confirmation message

    Scenario: user should not be able to renew the password with invalid email

        Given I enters to the web portal
        When  I entered my invalid Email-id and click on continue button
        Then  I should see the email is invalid confirmation message