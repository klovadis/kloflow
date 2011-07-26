
var Queue = new (require('./index.js').Queue)(1000);


// Only add a function as argument
Queue.add( function() {

	// do some output
	console.log('ONE!');

	// proceed to next item
	this();
});


// Only add a function as argument
Queue.add( function(done) {

	// do some output
	console.log('TWO!');

	// proceed to next item, using the function
	// that is provided as last argument
	done();
});


// Add a function plus some data to give to
// the function in the queue
Queue.add( function(data) {

	// do some output
	console.log('THREE:', data);

	// proceed to next item
	this();
	
}, {data:'some_data'} );


// add a function to the list of arguments
Queue.add( function(callback) {

	// do some output
	console.log('FOUR:', callback() );

	// proceed to next item
	this();
	
}, function () { return '(callback has been run)'; } );


// multiple arguments
Queue.add( function (d1, d2, f1) {
	
	// output the arguments we recieved
	console.log('FIVE:', d1, d2, f1() );
	
	// proceed to next item
	this();
	
}, 'data1', {data:2}, function () { return 'f1'; });


// Produce a timeout by not calling this()
Queue.add( function() {

	// do some output
	console.log("SIX: Let's cause a timeout!");
	
	var done = this;
	setTimeout(function () {
		console.log("SIX: Timeout should have passed, see what happens if we say that we're done ..");
		done();
	}, 1200);
});



// Pretend that this function takes 800ms to be ready
// so SIX will come crashing
Queue.add( function() {

	// do some output
	console.log("SEVEN: Beginning very long operation (800ms) ..");
	
	var done = this;
	setTimeout(function () {
		console.log("SEVEN: Whoa, we're done.");
		done();
	}, 800);
});


// Produce a timeout by not calling this()
Queue.add( function() {

	// do some output
	console.log("EIGHT: SIX and SEVEN should have completed beforehand.");
	
	// clear remaining items
	console.log("EIGHT: Clear the queue so NINE will never run.");
	Queue.clear();

	// proceed to next item
	this();
});


// Only add a function as argument
Queue.add( function() {

	// do some output
	console.log('NINE: Wait a minute, this should not happen!');

	// proceed to next item
	this();
});

