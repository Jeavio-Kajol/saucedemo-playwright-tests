# Manual Test Cases — SauceDemo Login Feature

# Author: [Kajol Gupta] | Date: [2026-10-21] | Status: DRAFT — not yet automated


## TC-001 | Priority: High | Type: Happy Path

Feature:      Login

Scenario:     Valid standard user login opens the inventory page

Precondition: SauceDemo is available. Use the standard demo account: `standard_user` / `secret_sauce`.

Steps:

1. Navigate to https://www.saucedemo.com/
1. Enter `standard_user` in the Username field
1. Enter `secret_sauce` in the Password field
1. Click the Login button

Expected:     The browser navigates to the inventory page (`/inventory.html`). The Products heading and product list are visible.

Notes:        This is a public demo account, not an administrator account. Do not use these credentials on any other site.

## TC-002 | Priority: High | Type: Negative

Feature:      Login

Scenario:     Incorrect password shows a login error

Precondition: SauceDemo login page is open.

Steps:        Enter `standard_user` as the username and an incorrect password → click Login

Expected:     The login error indicates that the username and password do not match. The user remains on the login page and the inventory page is not shown.

Notes:        Check that the error is readable and that the entered password remains masked.

## TC-003 | Priority: Medium | Type: Negative

Feature:      Login

Scenario:     Locked-out demo user cannot log in

Precondition: SauceDemo login page is open.

Steps:        Enter `locked_out_user` as the username and `secret_sauce` as the password → click Login

Expected:     A message explains that this user is locked out. The user remains on the login page.

Notes:        SauceDemo provides this account to demonstrate the locked-out state; it does not represent a lockout triggered by repeated attempts.

## TC-004 | Priority: Medium | Type: Edge Case

Feature:      Login

Scenario:     Empty login form shows required-field validation

Precondition: SauceDemo login page is open.

Steps:        Leave both fields empty → click Login

Expected:     An error indicates that the username is required. Login does not succeed and the inventory page is not shown.

Notes:        Also try entering a username while leaving the password empty; verify that the page indicates the password is required.

## TC-005 | Priority: Low | Type: Security

Feature:      Login

Scenario:     Password is obscured while being entered

Precondition: SauceDemo login page is open.

Steps:        Enter any text in the Password field without submitting the form

Expected:     The password characters are displayed as masking symbols rather than readable text.

Notes:        This checks what is visible in the page; it does not verify how credentials are transmitted or stored.