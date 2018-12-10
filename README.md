# Movie istings Challenge - Zone Test

Using the TMDb API display a list of now showing movies allowing the user to filter by genre and rating.

## Getting Started / running app

Put the 3 files (html, js and css) all in the same directory. 
Open index.html in a modern browser (Chrome etc)

### Prerequisites

* Network connection and browser
* [TMDb Movies Now Playing API](https://developers.themoviedb.org/3/movies/get-now-playing)
* [TMDb Movie genres API](https://developers.themoviedb.org/3/genres/get-movie-list)
* [TMDb Image API](https://developers.themoviedb.org/3/getting-started/images)
* [jQuery 3.3.1](https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js) 

## Running the tests

To run tests: in zoneTest.js set property ZONETEST._testingOn to true to run tests, set to false to bypass tests.
Tests are in runtime and are console.logged, each test is announced, and a message is given on failure.

### Test notes

I constructed a small testing object with bespoke functions. The prog is function-based so the functions are tested as units. The API calls have error/failure handling with moderate reporting to console. The tests are mainly on DOM generation and values read from DOM, properties or data read, and also data structures' integrity after processing. Any DOM testing is class-based in principle rather than structure-analysis as structure could alter without error during development.

### Code notes

That was fun yes. A tiny project so I decided not to use a framework (the spec says to do so if I liked) but I thought instead to show understanding of vanilla code (even so, at times I wished I'd frameworked it). I did use jQuery at a low level for the simplicity of its selectors and its ajax as recommended by the TMDB api. I made use of ES6 as requested, also cos ES6 features are very useful. No arrow functions but I couldn't really see a need for that anywhere.

* The app runs by calling the function to call the NowPlaying api. On done this calls the Genre api. The data input is stored (apis called only once) and on done that calls the routines to render film and genre-filter lists. Actions are bound to DOM objects after render, and only once too as the lists are drawn initially and then displayed using css:

* Hiding/showing items uses css class additions. Each film listing in the DOM is given classes denoting its genres. This works for short/clear code and quick css displays at this simple level. 
Although I'm aware that holding data in the DOM may not be best practice in general, (and I'd probably rewrite this using data structures in most cases) but in theory it's sound enough here and seemed a neat solution to the logic of displaying something if it has any one of a number of properties. 

* Responsive css - I used a minimum of responsive code, the simple page structure using floating elements resizes well enough and at mobile screen sizes shows a clear list down the page.

