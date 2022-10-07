import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime.js';
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './models.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) module.hot.accept();

const controlRecipe = async function () {
  try {
    // get hahsCode / id of product
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    // loader spinner
    recipeView.renderSpinner();

    // update to select the recipe
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    // collecting recipe data part 1
    await model.loadRecipe(id);

    // rendering recipe part 2
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
// controlRecipe();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    await model.loadSearchResults(query);

    if (!query) return;

    // console.log(model.state.search.results);

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlPagination = function (gotToPage) {
  resultsView.render(model.getSearchResultsPage(gotToPage));

  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  model.updateServings(newServing);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarksStorage = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // success message
    addRecipeView.renderSuccess();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // render recipe
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarksStorage);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServingHandler(controlServing);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerAddBookmarks(controlBookmark);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
