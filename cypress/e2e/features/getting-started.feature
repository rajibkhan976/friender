Feature: Getting started

    User should get the Sync now option to get all data of their facebook friend list

    Scenario: user should get the getting started page after successfull login

        Given  I land on the getting started page
        Then  I should see the steps below to complete the onboarding process

    Scenario: User should get their very first step of installing chrome extension

        Given I am on the getting started page
        Then  I get the 1st step to install the friender extension
        When  I click on the install now option
        Then  I should get the status installed

    Scenario: user should get the option to connect to their facebook account when in browser no account is logged in facebook

        Given I have come to the getting started page
        Then  I got my second step to connect my facebook account
        When  I click on the connect now button and in browser i am not connected with any facebook account
        Then  I should see below one banner will open instructing to login to an account in facebook
        When  I clicked on the button to login with an account in facebook
        # Then  I login to my facebook account
        # When  I get back to the getting started page once again
        # Then  I clicked on refresh button
        Then  I should see my current facebook account's username
        When  I clicked on the connect button to that account
        Then  I should see that connect now turns into connected

    Scenario: user should get the error message if suddenly in between gets logged out from their current facebook account

        Given I am landing the getting started page
        When  I clicked on the connect now button and it connects to my facebook account
        Then  I should see below one banner with my facebook account's username which is currently logged in
        When  I suddenly log out my current facebook account and coming to the previous page click on refresh button
        Then  I should get the error message
        
    Scenario: user should get their third step of syncing thier friend list to get all of friend list related data
        
        Given I came the getting started page
        Then  I should get my third step to sync my friend list
        When  I click on the sync now button and it syncs my curent facebook friend list which i am logged in currently
        Then  I can see my total count of facebook friends along with the count of synced friends from facebook
        Then  I click on the friends menu from left side i can my facebook friendlist
        Then  I should see all the friends related information