Feature: profile switch api test
    User should be able to switch multiple facebook profiles
    Scenario: user should be able to get the connect facebook api response
        Given I switch between the synced facebook profiles
        Then  I get the response properly according to the switched profile
