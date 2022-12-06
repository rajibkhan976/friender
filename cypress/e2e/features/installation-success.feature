Feature: installation success

    User should successfully get the installation success page

    Scenario: user should get the installation success page 

    Given  user successfully logs in to the portal
    When   user comes to the getting started page 
    Then   user redirects to the installation success page
    Then   user should see the extension success message
    Then   user can go to their dashboard