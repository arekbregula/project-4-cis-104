"use strict";

const PROMPT = require("readline-sync");
const SPACER = "-----------------------------------------------";

// Regex tests used to verify movie id and rating
const MOVIE_ID_REGEX = /^[0-9]*$/;
const MOVIE_RATING_REGEX = /^[0-5]$/;

let movies;
let sortOrder;

/**
 * Calculate the average rating for every movie
 */
function calculateMovieAverage() {
	for (let i = 0; i < movies.length; i++) {
		let sumOfRatings = movies[i].ratings.reduce((a, b) => a + b, 0);
		movies[i].average = sumOfRatings / movies[i].ratings.length;
	}
}

/**
 * Show a list of all movies along with their ID
 */
function showMovies() {
	console.log(SPACER);
	for (let i = 0; i < movies.length; i++) {
		console.log("\t" + String(i + 1) + ". " + movies[i].title + " (" + movies[i].average + " stars)");
	}
	console.log(SPACER);
}

/**
 * Show the main menu
 */
function showMainMenu() {
	console.log("Sort: " + sortOrder);

	console.log("Select a movie, type 'new' to add a new movie,");
	console.log("or 'sort' to change sort order.");
}

/**
 * Ask for the title, and initial rating for a new movie
 */
function addNewMovie() {
	console.log("\n");
	console.log(SPACER);
	let title = PROMPT.question("Movie title: ");
	movies.push({
		title: title,
		ratings: []
	});
}

/**
 * Ask for rating and add the rating to an existing movie
 * @param {Number} id The position of the movie in the movies array
 */
function addMovieRating(id) {
	let rating = PROMPT.questionInt("Your rating: ");
	if (!MOVIE_RATING_REGEX.test(rating)) {
		console.log("--- Movie rating invalid - Try again ---");
		addMovieRating(id);
	} else {
		movies[id].ratings.push(rating);
	}
}

/**
 * Gets the user's menu choice, and performs the action requested.
 * Called after displaying the main menu
 */
function askForMenuOption() {
	let selection = PROMPT.question(" >> ");
	switch (selection) {
		case "new":
			addNewMovie();
			addMovieRating(movies.length - 1);
			break;
		case "sort":
			setSortOrder();
			break;
		default:
			if (selection == "" || (!MOVIE_ID_REGEX.test(selection) || selection > movies.length)) {
				console.log("--- Movie ID invalid - Try again ---");
				askForMenuOption();
			}
			addMovieRating(Number(selection) - 1);
			break;

	}
}

/**
 * Sorts the movies based on their average rating.
 */
function sortMovies() {
	movies.sort((a, b) => {
		if (sortOrder == "high to low") {
			return a.average < b.average; // High to low
		} else {
			return a.average > b.average; // Low to high
		}
	});
}

/**
 * Toggles the sort order between 'high to low' and 'low to high'
 */
function setSortOrder() {
	if (sortOrder == "high to low") {
		sortOrder = "low to high";
	} else {
		sortOrder = "high to low";
	}
}

/**
 * Main dispatcher function
 */
function main() {
	movies = [];

	setSortOrder();

	while (true) {
		calculateMovieAverage();
		showMovies();
		showMainMenu();
		askForMenuOption();

		sortMovies();

		console.log("\n\n");
	}
}

main();