


var Queue = require('./lib/flow').Queue;
var Parallel = require('./lib/flow').Parallel;
var Serial = require('./lib/flow').Serial;


var q = new Queue(1000);

q.add(1, function (data) {
	console.log('Queue item ' + data);
	setTimeout(this, 800);
});

q.add(2, function (data) {
	console.log('Queue length:', q.length);
	console.log('Queue item ' + data);
	
	setTimeout(this, 1200);
});

q.add(3, function (data) {
	console.log('Queue length:', q.length);
	console.log('Queue item ' + data);
	setTimeout(this, 800);
	q.pause(function() {
		console.log('Were done with current item.');
		q.resume();
	});
	
});

q.add(4, function (data) {
	console.log('Queue length:', q.length);
	console.log('Queue item ' + data);
	setTimeout(this, 800);
});

q.add(5, function (data) {
	console.log('Queue length:', q.length);
	console.log('Queue item ' + data);
	setTimeout(this, 100);
});

q.add(function() {
	console.log('SIX!');
	this();	
});

console.log('done adding items');



Parallel(
	function (next) {
		setTimeout(function () {
			
			next(null, 'burger');
		}, 100);
	},
	function (next) {
		setTimeout(function () {
			
			next(null, 'cheese');
		}, 50);
	},
	function (next) {
		setTimeout(function () {
			//next('ham has gone bad');
			next(null, 'ham');
		}, 800);
	},
	function (err, f1, f2, f3) {
		
		if (err) throw err;
		
		console.log(err, f1, f2, f3);
		
	}
);



Serial(
	function () {
		//this('some error');
		this(null, 'dog', 'green');
	},
	function (err, animal, color) {
		//if (err) console.log('ERROR:', err);
		console.log('Animal:', animal, color);
		this(null, 'A ' + color + ' ' + animal + ' is a funny animal.');
		//this('w00t');
	},
	function (err, sentence) {
		if (err) return console.log('An error occurred:', err);
		console.log('Sentence:', sentence);	
		//this(null);	
	}
);


