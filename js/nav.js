'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug('navAllStories', evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug('updateNavOnLogin');
  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();
  $navMain.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show submit story form on click on "submit" */
function navSubmitClick() {
  hidePageComponents();
  $submitStoryForm.show();
}

$navSubmit.on('click', navSubmitClick);

/** Show user's favorited stories on click on "favorites" */
function navFavStories() {
  hidePageComponents();
  putFavoritesOnPage();
}

/** Show user's created stories on click on "my stories" */
function navMyStories() {
  hidePageComponents();
  $myStoriesList.empty();
  putOwnStoriesOnPage();
}

$body.on('click', '#nav-favorites', navFavStories);
$navMyStories.on('click', navMyStories);

/** Show user's profile on click on user's username */
function navUserProfile() {
  hidePageComponents();
  $userProfile.empty();
  putUserProfileOnPage();
}

$navUserProfile.on('click', navUserProfile);
