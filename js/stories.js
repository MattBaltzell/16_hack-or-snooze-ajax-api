"use strict";

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
 function showIcon() {
  const icon = `<i class="${currentUser.favorites.some(st=> st.storyId === story.storyId) ? 'fas':'far'} fa-bookmark" id="favorite-icon"></i>`
 
  return icon;

}
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  

  return $(`
    <li id="${story.storyId}">
      ${currentUser ? showIcon() : ''}
      <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(e){
  e.preventDefault()
  const author = $('#story-author').val()
  const title = $('#story-title').val()
  const url = $('#story-url').val()
  const story = await storyList.addStory(currentUser,{title, author, url})
  const $story = generateStoryMarkup(story)
  $allStoriesList.prepend($story);
}

$submitStoryForm.on('submit', submitNewStory)



async function toggleFavorite(evt){

  const id = $(evt.target).closest('li').attr('id')
  const story = storyList.stories.find(st=>st.storyId === id)
  
  if(evt.target.closest('i').classList.contains('fas')){
    await currentUser.removeFavorite(story)
    $(evt.target).closest('i').toggleClass('far fas')
  }
  else {
    await currentUser.addFavorite(story)
    $(evt.target).closest('i').toggleClass('far fas')
  }
  
}

async function putFavoritesOnPage() {
  console.log(currentUser.favorites.length)
 
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



$allStoriesList.on('click',"#favorite-icon", toggleFavorite)