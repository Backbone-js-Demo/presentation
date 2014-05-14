$(function(){

	// Highscore Model
	// ----------
	var Highscore = Backbone.Model.extend({

	// Default attributes for the hightscore item.
	defaults: function() {
	  return {
		first_name: "empty first name...",
		score: "empty score...",
		time: "empty time..."
	  };
	}
	});
  
	// Highscore Collection
	// ----------
	var HighscoreList = Backbone.Collection.extend({
		model: Highscore,
		
		localStorage: new Backbone.LocalStorage("highscore-backbone"),
		
		comparator: 'score'
	});
	
	var Highscorelist = new HighscoreList;
	
	// Highscore View
	// --------------
	var HighscoreView = Backbone.View.extend({
		tagName:  "li",
		template: _.template($('#item-template').html()),
	});

	// The Application
	// ---------------
	var lastkey = -1;
	var direction;
	var width = 50;
	var height = 50;
	var speed = 1;
	var speedCounter = 0;
	var snake = [];
	var paused = false;
	var score = -1;
	
	
	var AppView = Backbone.View.extend({
	
		events: {
			"keypress #start":  "start",
			"keypress #change-Direction": "changeDirection",
		},

		initialize: function() {
			document.onkeydown = this.$('.start');;
			var head = document.getElementById("firstDiv");
			head.style.top = "100px";
			head.style.left = "200px";
			width = head.clientWidth;
			height = head.clientHeight;
			snake.push(firstDiv);
		},
		
		start: function(event) {
			changeDirection(event);
			document.onkeydown = changeDirection;
			spawn();
			move();
			updateScore();
		},
		
		changeDirection: function(event) {
			var key = event.keyCode;
			
			switch(key) {
				case 37: if (lastkey != 39) {direction = key;} break; // left
				case 38: if (lastkey != 40) {direction = key;} break; // up
				case 39: if (lastkey != 37) {direction = key;} break; // right
				case 40: if (lastkey != 38) {direction = key;} break; // down
				case 80: if (!paused) alert("Game paused"); break;
				default: return false;
			}
		},
		
		move: function() {
			
			var head = snake[snake.length-1];
			var leftPos = parseInt(head.style.lesft.split("px")[0]);
			var topPos = parseInt(head.style.top.split("px")[0]);
			
			switch(direction) {
				case 37: leftPos = leftPos-50; break; // left
				case 38: topPos = topPos-50; break; // up
				case 39: leftPos = leftPos+50; break; // right
				case 40: topPos = topPos+50; break; // down
			}
			
			lastkey = direction;
			
			if (isCollided(leftPos, topPos)) { 
				var name = prompt("Game over!\n Score: "+score+"\n\n Enter name to submit your score"); 
				if (name != null && name !="") createHighscore(name, score); 
				return; 
			}
			
			// try to eat 
			eat(leftPos+"px", topPos+"px");
			
			// get new head and change position
			head = snake.shift();
			head.style.left = leftPos+"px";
			head.style.top = topPos+"px";
			snake.push(head);
			
			// accelerate snake
			speedUp();
			setTimeout("move()", 500/speed);
		},
		
		speedUp: function() {
			speedCounter++;
			if (speedCounter == 10) {
				speed = speed+0.1;
				speedCounter = 0;
			}
		},
		
		eat: function(leftPos, topPos) {
			var meal = document.getElementById("meal");
			
			if (topPos === meal.style.top && leftPos === meal.style.left) {
				meal.className = "moveable";
				meal.removeAttribute("id"); // remove id because the newly spawned meal will get the id
				snake.push(meal);
				spawn();
				updateScore();
			}
		},
		
		spawn: function() {
			var meal = document.createElement('div');
			meal.setAttribute("id", "meal");
			
			var left;
			var top;
			var spawnInSnake = true;
			
			// try to spawn a new meal as long as it spawns somewhere within the snake
			while(spawnInSnake) {
				spawnInSnake = false;
				for (var i = 0; i < snake.length; i++) {
					left = parseInt(Math.random()*19)*50+50+"px";
					top = parseInt(Math.random()*9)*50+50+"px";
					if (snake[i].style.left === left && snake[i].style.top === top) {
						spawnInSnake = true;
						break;
					}
				}
			}
			
			meal.style.left = left;
			meal.style.top = top;	
			document.body.appendChild(meal); // append the new part of the sname		
		},
		
		isCollided: function(leftPos, topPos) {
			
			// collision with border
			if (leftPos < 50) return true; // too far left
			if (topPos < 50) return true; // too far up
			if (leftPos + width > 1050) return true; // too far right
			if (topPos + height > 550) return true; // too far down
			
			// collision with itself
			leftPos = leftPos+"px";
			topPos = topPos+"px";
			
			for (var i = 1; i < snake.length-1; i++) { // dont check first element, dont check trivial case
				var left = snake[i].style.left;
				var top = snake[i].style.top;
				if (leftPos === left && topPos === top) return true;
			}
			
			return false; // phew, that was close - no collision!
		},
		
		updateScore: function() {
			score++;
			document.getElementById("score").innerHTML = "Score: "+score;
		},
		
		createHighscore: function(score, name) {

			if (!this.input_last_name.val()) return;
			if (!this.input_email.val()) return;
			
			HighscoreList.create({	name: this.score(),
								score: this.name()
			});
		}
	
	});
	var App = new AppView;

});
