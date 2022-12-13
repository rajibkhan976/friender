


Feature: Tell me about yourself

    User should be able to see Onboarding page after reset-password

    # Scenario: user should be able to skip Tell me about Yourself page
        
        #     Given I can login with this newly changed password
        #     Then I will landed up into Tell me about Yourself page and I want to skip That page

    Scenario: user should be able to give answer to all the questions in the page

        Given I signin newly to Friender
        When  I Logged in with the default password
        Then  I should landed in the reset-password page and can change the password
        Then  I will lanOnboarding pageded up into Tell me about Yourself page and I want to give answer to all questions
