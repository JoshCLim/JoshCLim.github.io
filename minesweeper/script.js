var rowNum = 20;
var colNum = 30;

var mineNum = 0;
var minesFlagged = 0;

var mineChance = 0.23;

var firstClick = true;

var t;

var squares;

var alive = true;
var won = false; // to prevent the win function from being triggered multiple times

var darkColour = "#555555";
var lightColour = "#666666";
var flagColour = "#ffffff";

var root = document.documentElement;




// https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
var startTime = Math.floor(Date.now() / 1000); //Get the starting time (right now) in seconds
localStorage.setItem("startTime", startTime); // Store it if I want to restart the timer on the next page

function startTimeCounter() {
    var now = Math.floor(Date.now() / 1000); // get the time now
    var diff = now - startTime; // diff in seconds between now and start
    var m = Math.floor(diff / 60); // get minutes value (quotient of diff)
    var s = Math.floor(diff % 60); // get seconds value (remainder of diff)
    m = checkTime(m); // add a leading zero if it's single digit
    s = checkTime(s); // add a leading zero if it's single digit
    document.getElementById("timer").innerHTML = m + ":" + s; // update the element where the timer will appear
    t = setTimeout(startTimeCounter, 500); // set a timeout to update the timer
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}




function win() {
	clearTimeout(t); // stop timer
	if (won == false) {
		setTimeout(function() {
			alert("you win");
		}, 500);
		won = true;
	}
}

function checkWin() { // check if youve won and update mine counter
	minesFlagged = document.getElementsByClassName("mine flagged").length;
	var flagged = document.getElementsByClassName("flagged").length;

	document.querySelector("#mine-counter span").innerHTML = mineNum - flagged;


	if ((mineNum == minesFlagged) && (mineNum == flagged) && (alive == true)) {
		win();
	} else {

	}
}

function solve() {
	for (var q = 0; q < squares.length; q++) {
		if (squares[q].classList.contains("mine")) {
			squares[q].classList.add("flagged");
			//squares[q].classList.add("exploded");
		} else {
			squares[q].classList.add("uncovered");
		}
	}

	checkWin();
}

function undo() {
	let mines = document.getElementsByClassName("mine");

	for (var q = 0; q < mines.length; q++) {
		mines[q].classList.remove("exploded");
	}

	alive = true;

	startTimeCounter(); // resume timer
}

function gameOver() {
	//console.log("GAME OVER");
	 clearTimeout(t); // stop timer

	let mines = document.getElementsByClassName("mine");

	for (var q = 0; q < mines.length; q++) {
		mines[q].classList.add("exploded");
	}

	alive = false;

	//alert('u died lol (reload to restart)');
}

function search(i) {
	if (squares[i].classList.contains("flagged")) {
		return;
	} else if (squares[i].classList.contains("mine")) {
		gameOver();
		return;
	} else {
		squares[i].classList.add("uncovered");
	}

	var mineBefore = i - 1;
	var mineAfter = i + 1;
	var mineAbove = i - colNum;
	var mineBelow = i + colNum;
	var mineTopRight = i - colNum + 1;
	var mineTopLeft = i - colNum - 1;
	var mineBottomRight = i + colNum + 1;
	var mineBottomLeft = i + colNum - 1;

	var isTop = false;
	var isBottom = false;
	var isRight = false;
	var isLeft = false;

	if ((i % colNum) == 0) { isLeft = true;	}										// if the square is in the left column

	if ((i % colNum) == (colNum-1)) { isRight = true; }								// if the square is in the right column
		
	if (i < colNum) { isTop = true;	}												// if the square is in the top row
		
	if (i > (colNum * (rowNum - 1) - 1)) { isBottom = true;	}						// if the square is in the bottom row

	if (squares[i].classList.contains("s1") || squares[i].classList.contains("s2") || squares[i].classList.contains("s3") || squares[i].classList.contains("s4") || squares[i].classList.contains("s5") || squares[i].classList.contains("s6") || squares[i].classList.contains("s7") || squares[i].classList.contains("s8")) {
		if (isLeft == false) {
     		if (squares[mineBefore].classList.contains("s0")) {
	     		uncover(mineBefore);
	     	}
     	}
     	if (isRight == false) {
     		if (squares[mineAfter].classList.contains("s0")) {
	     		uncover(mineAfter);
	     	}
     	}
     	if (isTop == false) {
     		if (squares[mineAbove].classList.contains("s0")) {
	     		uncover(mineAbove);
	     	}
     	}
     	if (isBottom == false) {
     		if (squares[mineBelow].classList.contains("s0")) {
	     		uncover(mineBelow);
	     	}
     	}
     	if ((isLeft == false) && (isTop == false)) {
     		if (squares[mineTopLeft].classList.contains("s0")) {
	     		uncover(mineTopLeft);
	     	}
     	}
     	if ((isRight == false) && (isTop == false)) {
     		if (squares[mineTopRight].classList.contains("s0")) {
	     		uncover(mineTopRight);
	     	}
     	}
     	if ((isLeft == false) && (isBottom == false)) {
     		if (squares[mineBottomLeft].classList.contains("s0")) {
	     		uncover(mineBottomLeft);
	     	}
     	}
     	if ((isRight == false) && (isBottom == false)) {
     		if (squares[mineBottomRight].classList.contains("s0")) {
	     		uncover(mineBottomRight);
	     	}
     	}
	}
}

function uncover(i) {		// recursion !!!

	if (squares[i].classList.contains("mine") || squares[i].classList.contains("uncovered")) {
		return;
	}

	squares[i].classList.add("uncovered");

	if (squares[i].classList.contains("flagged")) {
		squares[i].classList.remove("flagged");
		checkWin();
	}

	var mineBefore = i - 1;
	var mineAfter = i + 1;
	var mineAbove = i - colNum;
	var mineBelow = i + colNum;
	var mineTopRight = i - colNum + 1;
	var mineTopLeft = i - colNum - 1;
	var mineBottomRight = i + colNum + 1;
	var mineBottomLeft = i + colNum - 1;

	var isTop = false;
	var isBottom = false;
	var isRight = false;
	var isLeft = false;

	if ((i % colNum) == 0) { isLeft = true;	}										// if the square is in the left column

	if ((i % colNum) == (colNum-1)) { isRight = true; }								// if the square is in the right column
		
	if (i < colNum) { isTop = true;	}												// if the square is in the top row
		
	if (i > (colNum * (rowNum - 1) - 1)) { isBottom = true;	}						// if the square is in the bottom row

	if (squares[i].classList.contains("s0")) {										// if the square is a zero square

		setTimeout(function() {
			if (isLeft == false) {
			uncover(mineBefore);
			}
			if (isRight == false) {
				uncover(mineAfter);
			}
			if (isTop == false) { 
				uncover(mineAbove);
			}
			if (isBottom == false) { 
				uncover(mineBelow);
			}
			if ((isLeft == false) && (isTop == false)) { 
				uncover(mineTopLeft);
			}
			if ((isRight == false) && (isTop == false)) { 
				uncover(mineTopRight);
			}
			if ((isLeft == false) && (isBottom == false)) { 
				uncover(mineBottomLeft);
			}
			if ((isRight == false) && (isBottom == false)) { 
				uncover(mineBottomRight);
			}
		}, 10);
		
	}
}

function advancedSearch(i) {

	if (alive == false) {
		return false;
	}

	let mineNumber;
	let flagCounter = 0;
	let coveredCounter = 0;

	if (squares[i].classList.contains("s1")) {
		mineNumber = 1;
	} else if (squares[i].classList.contains("s2")) {
		mineNumber = 2;
	} else if (squares[i].classList.contains("s3")) {
		mineNumber = 3;
	} else if (squares[i].classList.contains("s4")) {
		mineNumber = 4;
	} else if (squares[i].classList.contains("s5")) {
		mineNumber = 5;
	} else if (squares[i].classList.contains("s6")) {
		mineNumber = 6;
	} else if (squares[i].classList.contains("s7")) {
		mineNumber = 7;
	} else if (squares[i].classList.contains("s8")) {
		mineNumber = 8;
	} else {
		return;
	}

	var mineBefore = i - 1;
	var mineAfter = i + 1;
	var mineAbove = i - colNum;
	var mineBelow = i + colNum;
	var mineTopRight = i - colNum + 1;
	var mineTopLeft = i - colNum - 1;
	var mineBottomRight = i + colNum + 1;
	var mineBottomLeft = i + colNum - 1;

	var isTop = false;
	var isBottom = false;
	var isRight = false;
	var isLeft = false;

	if ((i % colNum) == 0) { isLeft = true;	}										// if the square is in the left column

	if ((i % colNum) == (colNum-1)) { isRight = true; }								// if the square is in the right column
		
	if (i < colNum) { isTop = true;	}												// if the square is in the top row
		
	if (i > (colNum * (rowNum - 1) - 1)) { isBottom = true;	}						// if the square is in the bottom row

	if (isLeft == false) {
 		if (squares[mineBefore].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (!(squares[mineBefore].classList.contains("uncovered"))) {
     		coveredCounter += 1;
     	}
 	}
 	if (isRight == false) {
 		if (squares[mineAfter].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (!(squares[mineAfter].classList.contains("uncovered"))) {
     		coveredCounter += 1;
     	}
 	}
 	if (isTop == false) {
 		if (squares[mineAbove].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (!(squares[mineAbove].classList.contains("uncovered"))) {
     		coveredCounter += 1;
     	}
 	}
 	if (isBottom == false) {
 		if (squares[mineBelow].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (!(squares[mineBelow].classList.contains("uncovered"))) {
     		coveredCounter += 1;
     	}
 	}
 	if ((isLeft == false) && (isTop == false)) {
 		if (squares[mineTopLeft].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (!(squares[mineTopLeft].classList.contains("uncovered"))) {
     		coveredCounter += 1;
     	}
 	}
 	if ((isRight == false) && (isTop == false)) {
 		if (squares[mineTopRight].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (!(squares[mineTopRight].classList.contains("uncovered"))) {
     		coveredCounter += 1;
     	}
 	}
 	if ((isLeft == false) && (isBottom == false)) {
 		if (squares[mineBottomLeft].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (!(squares[mineBottomLeft].classList.contains("uncovered"))) {
     		coveredCounter += 1;
     	}
 	}
 	if ((isRight == false) && (isBottom == false)) {
 		if (squares[mineBottomRight].classList.contains("flagged")) {
     		flagCounter += 1;
     	}
     	if (!(squares[mineBottomRight].classList.contains("uncovered"))) {
     		coveredCounter += 1;
     	}
 	}

 	if (flagCounter == mineNumber) {
 		if (isLeft == false) {
	 		search(mineBefore);
	 	}
	 	if (isRight == false) {
	 		search(mineAfter);
	 	}
	 	if (isTop == false) {
	 		search(mineAbove);
	 	}
	 	if (isBottom == false) {
	 		search(mineBelow);
	 	}
	 	if ((isLeft == false) && (isTop == false)) {
	 		search(mineTopLeft);
	 	}
	 	if ((isRight == false) && (isTop == false)) {
	 		search(mineTopRight);
	 	}
	 	if ((isLeft == false) && (isBottom == false)) {
	 		search(mineBottomLeft);
	 	}
	 	if ((isRight == false) && (isBottom == false)) {
	 		search(mineBottomRight);
	 	}
 	}

 	if (coveredCounter == mineNumber) {
 		if (isLeft == false) {
	 		if (!(squares[mineBefore].classList.contains("uncovered"))) {
	 			squares[mineBefore].classList.add("flagged");
	 		}
 	}
	 	if (isRight == false) {
	 		if (!(squares[mineAfter].classList.contains("uncovered"))) {
	 			squares[mineAfter].classList.add("flagged");
	 		}
	 	}
	 	if (isTop == false) {
	 		if (!(squares[mineAbove].classList.contains("uncovered"))) {
	 			squares[mineAbove].classList.add("flagged");
	 		}
	 	}
	 	if (isBottom == false) {
	 		if (!(squares[mineBelow].classList.contains("uncovered"))) {
	 			squares[mineBelow].classList.add("flagged");
	 		}
	 	}
	 	if ((isLeft == false) && (isTop == false)) {
	 		if (!(squares[mineTopLeft].classList.contains("uncovered"))) {
	 			squares[mineTopLeft].classList.add("flagged");
	 		}
	 	}
	 	if ((isRight == false) && (isTop == false)) {
	 		if (!(squares[mineTopRight].classList.contains("uncovered"))) {
	 			squares[mineTopRight].classList.add("flagged");
	 		}
	 	}
	 	if ((isLeft == false) && (isBottom == false)) {
	 		if (!(squares[mineBottomLeft].classList.contains("uncovered"))) {
	 			squares[mineBottomLeft].classList.add("flagged");
	 		}
	 	}
	 	if ((isRight == false) && (isBottom == false)) {
	 		if (!(squares[mineBottomRight].classList.contains("uncovered"))) {
	 			squares[mineBottomRight].classList.add("flagged");
	 		}
	 	}
 	}
 	checkWin();
}

document.querySelector("#game-wrapper").addEventListener('contextmenu', event => event.preventDefault()); // stop right clicking the game from opening the menu

function initSettings() {
	root.style.setProperty("--darkblue", darkColour);								// set css variables
	root.style.setProperty("--lightblue", lightColour);
	root.style.setProperty("--darkorange", flagColour);

	document.getElementById("colNumInput").value = colNum;							// set default values for settings
	document.getElementById("rowNumInput").value = rowNum;
	document.getElementById("lightColourInput").value = lightColour;
	document.getElementById("darkColourInput").value = darkColour;
	document.getElementById("flagColourInput").value = flagColour;
	document.getElementById("mineChanceInput").value = mineChance;
	document.getElementById("neverLoseCheckbox").checked = true;

	var settingsInputs = document.getElementsByClassName("settings-input");

	for (let i = 0; i < settingsInputs.length; i++) {
		settingsInputs[i].addEventListener("blur", (event) => {
			let newVal = settingsInputs[i].value;
			let newId = settingsInputs[i].id;

			if (settingsInputs[i].type == "number") {								// change the data type to a number if the number inputs were changed
				window[newId.substring(0, newId.length - 5)] = parseFloat(newVal);
			} else {
				window[newId.substring(0, newId.length - 5)] = newVal;
			}

			root.style.setProperty("--darkblue", darkColour);						// set css variables
			root.style.setProperty("--lightblue", lightColour);
			root.style.setProperty("--darkorange", flagColour);
		});
	}
}

function startGame(num) {

	// reset Timer
	clearTimeout(t);
	startTime = Math.floor(Date.now() / 1000); //Get the starting time (right now) in seconds

	alive = true;
	won = false;

	const neverLoseCheckbox = document.getElementById("neverLoseCheckbox");
	if (neverLoseCheckbox.checked == true) {
		firstClick = true;
	} else {
		firstClick = false;
	}
	

    var gameWrapper = document.querySelector("#game-wrapper tbody"); 				// get the game wrapper table 

    gameWrapper.innerHTML = "";														// clear the game wrapper
    mineNum = 0;																	// set the number of mines to 0
    minesFlagged = 0;																// set the number of mines flagged to 0

    for (var i = 0; i < rowNum; i++) { 												// add rows
    	gameWrapper.innerHTML += "<tr class='row row" + i + "'></tr>";
    } 

    for (var row in gameWrapper.children) { 										// loop through table rows
    	for (var i = 0; i < colNum; i++) {												// add columns
	    	gameWrapper.children[row].innerHTML += "<td class='square'></td>";
	    }
    }

    squares = document.getElementsByClassName("square");							// get 'HTML Collection' (array) of all squares

    for (let i = 0; i < squares.length; i++) { 										// loop through all squares

    	var pressTimer;
		squares[i].addEventListener('mouseup', function(){							// if long press, add flag
		  clearTimeout(pressTimer);
		  // Clear timeout
		  return false;
		})
		squares[i].addEventListener('mousedown', function() {
		  // Set timeout
		  pressTimer = window.setTimeout(function() {
		  	this.classList.add("flagged")
		  },700);
		  return false; 
		});


    	squares[i].addEventListener('click', function(e) {								// add event listener for left click
    		e.preventDefault();

			//console.log(squares[i])

			if (this.classList.contains("flagged")) {										// if they clicked on a flagged square
				
				//console.log("flagged");														// do nothing

			} else {

				if (this.classList.contains("mine")) {										// if they clicked on a mine
					
					if ((firstClick == true) && (mineChance != 1)) {								// if it is their first click, restart the game
						startGame(i);
					} else {
						gameOver();																	// they lose
					}

				} else {

					if (this.classList.contains("s0")) {									// if they clicked on a zero square

						firstClick = false;

						uncover(i);

					} else {																// if they clicked on a number square

						firstClick = false;

						if (this.classList.contains("uncovered")) {								// if it has already been uncovered
							advancedSearch(i);
						} else {																// if it hasn't yet been uncovered
							search(i);
						}
					}
				}
			}
    	});

    	squares[i].addEventListener('contextmenu', function(e) {						// add event listeners for right click
    		e.preventDefault();

    		if (this.classList.contains("uncovered")) {									// if they right click on an uncovered square
    																						// do nothing
    		} else {
    			if (this.classList.contains("flagged")) {								// if they right click on a flagged square

    				if (won == false) {
						this.classList.remove("flagged");									// remove the flag
						checkWin();
					}

				} else if (alive == true) {												// if they are still alive and right click on a mine

					this.classList.add("flagged");											// add the flag

					checkWin();

				}
    		}			
    	});

    	if (Math.random() < mineChance) {												// x% chance that a square is a mine	
    		squares[i].classList.add("mine");											// add 'mine' class for mine squares
    		mineNum += 1;																// add 1 to the mine counter
    	}
    }

    document.querySelector("#mine-counter span").innerHTML = mineNum;				// display the number of mines

    var mineCounter;

    for (var i = 0; i < squares.length; i++) {										// loop through all squares AGAIN to assign numbers

     	mineCounter = 0;

     	let mineBefore = i - 1;
     	let mineAfter = i + 1;
     	let mineAbove = i - colNum;
     	let mineBelow = i + colNum;
     	let mineTopRight = i - colNum + 1;
     	let mineTopLeft = i - colNum - 1;
     	let mineBottomRight = i + colNum + 1;
     	let mineBottomLeft = i + colNum - 1;

     	let isTop = false;
     	let isBottom = false;
     	let isRight = false;
     	let isLeft = false;

     	if ((i % colNum) == 0) { isLeft = true;	}										// if the square is in the left column

     	if ((i % colNum) == (colNum-1)) { isRight = true; }								// if the square is in the right column
     		
     	if (i < colNum) { isTop = true;	}												// if the square is in the top row
     		
     	if (i > (colNum * (rowNum - 1) - 1)) { isBottom = true;	}						// if the square is in the bottom row

    	
     	if (isLeft == false) {
     		if (squares[mineBefore].classList.contains("mine")) {
	     		mineCounter++;
	     	}
     	}
     	if (isRight == false) {
     		if (squares[mineAfter].classList.contains("mine")) {
	     		mineCounter++;
	     	}
     	}
     	if (isTop == false) {
     		if (squares[mineAbove].classList.contains("mine")) {
	     		mineCounter++;
	     	}
     	}
     	if (isBottom == false) {
     		if (squares[mineBelow].classList.contains("mine")) {
	     		mineCounter++;
	     	}
     	}
     	if ((isLeft == false) && (isTop == false)) {
     		if (squares[mineTopLeft].classList.contains("mine")) {
	     		mineCounter++;
	     	}
     	}
     	if ((isRight == false) && (isTop == false)) {
     		if (squares[mineTopRight].classList.contains("mine")) {
	     		mineCounter++;
	     	}
     	}
     	if ((isLeft == false) && (isBottom == false)) {
     		if (squares[mineBottomLeft].classList.contains("mine")) {
	     		mineCounter++;
	     	}
     	}
     	if ((isRight == false) && (isBottom == false)) {
     		if (squares[mineBottomRight].classList.contains("mine")) {
	     		mineCounter++;
	     	}
     	}

     	
    	squares[i].classList.add("s" + mineCounter);									// assign class based on mineCounter
	    
    }

    if (num == -1) {

    } else {
    	squares[num].click();
    }

    startTimeCounter();
};

document.addEventListener("DOMContentLoaded", (event) => {									// wait till the DOM is loaded
	document.getElementById("undo").addEventListener("click", undo);

	initSettings();
	startGame(-1);
});