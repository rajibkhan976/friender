Feature: profile space
    User should see their profile suceesfully once he logs in to the facebook
    Scenario: user should see their currently logged in facebook profile under profilespace
        Given I have logged in to the friender web portal
        When  I should open the profile space
        Then  I can see the account i am logged in in facebook
    Scenario: user should see multiple facebook profiles added under the profile space
        Given I am on the getting-started page
        When  I logged in to the another facebook profile
        Then  I can see that facebook profile is showing in the list
        Then  I switch to that profile and the profile name is showing as deafult logged in profile
    Scenario: user should see their friend list and number of friends everything related to that profile according to the profile he switches
        Given I open the profile space
        When  I switch to any of the existing profiles
        Then  I go to my friend list page
        Then  I can see my total number of friends is matched according to my profile friends
