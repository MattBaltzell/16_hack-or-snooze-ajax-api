"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navMain.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


/** Show submit story form on click on "submit" */
function navSubmitClick(){
  hidePageComponents();
  $submitStoryForm.show()
}

$navSubmit.on('click', navSubmitClick)



function navFavStories(){
  hidePageComponents();
  putFavoritesOnPage()
}


function navMyStories(){
  hidePageComponents();
  $myStoriesList.empty()

  if(currentUser.ownStories.length === 0) {
    const $message = `<p>No stories added!</p>`
    $myStoriesList.append($message)
    return $myStoriesList.show();
  }
  
  putOwnStoriesOnPage()
}


$body.on('click', '#nav-favorites' ,navFavStories)
$navMyStories.on('click', navMyStories)