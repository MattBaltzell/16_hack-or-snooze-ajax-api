'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  const hostName = story.getHostName();

  const showIcon = Boolean(currentUser);

  return $(`
    <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ''}
      ${showIcon ? getIconHTML(story, currentUser) : ''}
      <a href="${story.url}" target="a_blank" class="story-link">${
    story.title
  }</a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

/**
 * A render method to render HTML for a delete button
 * - Returns the markup for the delete button.
 */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/**
 * A render method to render HTML for the favorite icon
 * - Returns the markup for the favorite icon.
 */

function getIconHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const iconType = isFavorite ? 'fas' : 'far';
  return `<span class="favorite-icon"><i class="${iconType} fa-bookmark" id="favorite-icon"></i><span class="trash-can">`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all stories and generate HTML for them and and puts story list on page.
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Deletes this story from server, and puts updated story list on page. */

async function deleteStory(evt) {
  console.debug('deleteStory');

  const $closestLi = $(evt.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);
  putOwnStoriesOnPage();
}

$myStoriesList.on('click', '.trash-can', deleteStory);

/** Submits story form. Adds new story onto story list on the server. */

async function submitNewStory(e) {
  e.preventDefault();
  const author = $('#story-author').val();
  const title = $('#story-title').val();
  const url = $('#story-url').val();
  const story = await storyList.addStory(currentUser, { title, author, url });
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $submitStoryForm.hide();
  $allStoriesList.show();
  // reset form values
  $('#story-author').val('');
  $('#story-title').val('');
  $('#story-url').val('');
}

$submitStoryForm.on('submit', submitNewStory);

/** Adds or removes favorite from the UI. */

async function toggleFavorite(evt) {
  const id = $(evt.target).closest('li').attr('id');
  const story = storyList.stories.find((st) => st.storyId === id);

  if ($(evt.target).hasClass('fas')) {
    await currentUser.removeFavorite(story);
    $(evt.target).closest('i').toggleClass('far fas');
  } else {
    await currentUser.addFavorite(story);
    $(evt.target).closest('i').toggleClass('far fas');
  }
}

$body.on('click', '#favorite-icon', toggleFavorite);

/** Adds user's favorites list to the page.
 * - default message if user has no favorites
 */

async function putFavoritesOnPage() {
  $favStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    const $message = `<p>No favorites added!</p>`;
    $favStoriesList.append($message);
  } else {
    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStoriesList.append($story);
    }
  }

  $favStoriesList.show();
}

/** Adds user's own stories list to the page.
 * - default message if user has no stories
 */

async function putOwnStoriesOnPage() {
  hidePageComponents();
  $myStoriesList.empty();
  // loop through all of our stories and generate HTML for them

  if (currentUser.ownStories.length === 0) {
    const $message = `<p>No stories have been added yet!</p>`;
    $myStoriesList.append($message);
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $myStoriesList.append($story);
    }
  }

  $myStoriesList.show();
}
