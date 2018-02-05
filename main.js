"use strict";

const PROMPT = require("readline-sync");
const SPACER = "-----------------------------------------------";

const MAIN_MENU_OPTIONS = [
	["sort", "change sort order"],
	["new", "add new movie"]
];

const MOVIE_ID_REGEX = /^[0-9]*$/;
const MOVIE_RATING_REGEX = /^[0-5]$/;

let movies;
let sortOrder;

function calculateMovieAverage() {
	for(let i = 0; i < movies.length; i++) {
		let sumOfRatings = movies[i].ratings.reduce((a, b) => a + b, 0);
		movies[i].average = sumOfRatings/movies[i].ratings.length;
	}
}

function showMovies() {
	for(let i = 0; i < movies.length; i++) {
		console.log("\t" + String(i+1) + ". " + movies[i].title + " (" + movies[i].average + " stars)");
	}
}

function showMainMenu() {
	console.log(SPACER);
	showMovies();
	console.log(SPACER);

	console.log("Sort: " + sortOrder);

	console.log("Select a movie, type 'new' to add a new movie,");
	console.log("or 'sort' to change sort order.");
}

function addNewMovie() {
	console.log("\n");
	console.log(SPACER);
	let title = PROMPT.question("Movie title: ");
	movies.push({title: title, ratings: []});
}

function addMovieRating(id) {
	let rating = PROMPT.questionInt("Your rating: ");
	if(!MOVIE_RATING_REGEX.test(rating)) {
		console.log("--- Movie rating invalid - Try again ---");
		addMovieRating(id);
	} else {
		movies[id].ratings.push(rating);
	}
}

function askForMenuOption() {
	let selection = PROMPT.question(" >> ");
	switch(selection) {
		case "new": {
			addNewMovie();
			addMovieRating(movies.length - 1);
			break;
		}
		case "sort": {
			setSortOrder();
			break;
		}
		default: {
			if(!MOVIE_ID_REGEX.test(selection) || selection > movies.length) {
				console.log("--- Movie ID invalid - Try again ---");
				askForMenuOption();
			}
			addMovieRating(Number(selection)-1);
			break;
		}
	}
}

function sortMovies() {
	movies.sort((a, b) => {
		if(sortOrder == "high to low") {
			return a.average < b.average; // High to low
		} else {
			return a.average > b.average; // Low to high
		}
	});
}

function setSortOrder() {
	if(sortOrder == "high to low") {
		sortOrder = "low to high";
	} else {
		sortOrder = "high to low";
	}
}

function main() {
	movies = [];

	setSortOrder();
	
	while(1) {
		console.log("\n\n");

		calculateMovieAverage();
		showMainMenu();
		askForMenuOption();

		sortMovies();
	}
}

main();