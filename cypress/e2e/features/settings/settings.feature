Feature: settings page configuration
    User should change their settings successfully
    Scenario: user should enable/disable the settings from my setting page as per requirement
        Given I logged in to the friender web portal
        When  I should come to the my setting page
        Then  I can see the header
    Scenario: user should enable/disable the setting not to send the  friend requests to people they've been friends with before
        Given I should see the required options
        Then  I click on the toggle buttons if they want to enable those
        Then  I should see the successfully saved settings confirmation popup
    # Scenario: user should be able to refriending the friends if required
    #     Given I should see the Re-Friending option
    #     When  I enable that button
    #     Then  I should give the input time value to Remove pending friend request and select time accordingly
    Scenario: user should be able to cancelling the friend requests if required
        Given I should see Cancel Sent Friend Requests option
        Then  I should give the input time value to Remove sent friend request and select the time
    # Scenario: user should be able to send the message whenever a new friend request comes
    #     Given user should see Send message when you receive a new friend request from someone option
    #     Then  user should can select a message template and provide time and value to send to the new friend
    # Scenario: user should be able to send the message whenever accepting new friend request comes
    #     Given user should see Send message when you accept a friend request you received from someone.
    #     Then  user selects a message template and provide time and its value accordingly to send to the new friend
    #Scenario: user should be able to send the message whenever declining a  new friend request
    #     Given user should see Send message when you decline a friend request you received from someone. option
    #     Then  user select a message template to send to the new friend
    #     Then  user give the input time value to send the message
    #     Then  user select the messgae sending time
    #Scenario: user should be able to send the message whenever someone accepts their friend request
    #     Given  user should see Send message when someone accepts my friend request. option
    #     Then  user can select a message template to send to the new friend
    #     Then  user can give the input time value to send the message
    # #     Then  user can select the messgae sending time
    # Scenario: user should be able to check friend's engagemeent
    #     Given user should see Day back to analyse friends engagement option
    #     Then  user can see Select the time you want to sync. From
    #     Then  user can select the to and from time
    Scenario: user should see their changed settings remains as it is he made after he refreshes the page
        Given user should make some changes in the page
        When  user reloads the page once or login to the same account once again
        Then  user should see the settings remains the same
#   Scenario: user should see the validation message if they keeps the input fields empty
#     Given  user sees the Re-Friending option
#     When   user keeps the input field empty
#     Then   user clicks on the next  toggle button
