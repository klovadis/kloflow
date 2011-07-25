# Flow Control Library for Node.js

This is a self-written flow control library that currently exports three functions: `Parallel` execution, `Serial` execution and a `Queue` class which allows to add items constantly to the queue. 

It's easy to use and lightweight, but thorough testing is pending. There are many flow control libraries for [Node.JS](http://nodejs.org/) and JavaScript in general, but in order to get more into Node and server-side JavaScript, I created my own.

## .Parallel

The export `.Parallel` allows you to run multiple functions in parallel and call a callback function once all of them have finished. Use`Parallel ( function f1, function f2, .. , function (err, f1Data, f2Data, ..) );` and provide any amount (2+) of functions as arguments. 

    // include the library
    var Parallel = require('./kloflow');
    
    // run two functions in parallel and call the last
    // function when all calculations are done or if
    // an error occurred.
    
    Parallel(
    	
        function (done) { 
        	/* function 1, do something async here */
        	
        	// call done(); once youre ready
        	done(null, 'data_1');
        },
        
        function (done) {
        	/* function 2, do something async here */
        	
        	// call done(); once youre ready
        	done(null, 'data_2');
        },
        
        // the last function is the ready function
        function (err, f1Result, f2Result) {
        
            // if an error occurred, throw it
            if (err) throw err;
            
            // output results
            console.log(err, f1Result, f2Result);
        }
    );

Each of those functions will recieve an argument `done` when called, which is a callable `function (err, result)` which you should call once you're done. Instead of calling `done(null, result)`, you can also call `this(null, result)` - have it your way.

The last function that is supplied however will be called once all the other functions have finished. It should expect the first argument to be an `error or null`, the next arguments will hold the values of the other functions that were called in their corresponding order. 

The use of this function is to i.e. fetch data from different sources in parallel and then provide that data to one single callback function. You could for example grab data from different database collections at the same time instead of having to wait for the first result.

    // include the library
    var Parallel = require('./kloflow').Parallel;
    
    // imagine, those functions are defined
    // function getUsersFromDb() {}
    // function getMessagesFromDb() {}
    // function getStatisticsFromDb() {}
    
    Parallel(
    	getUsersFromDb,
    	getMessagesFromDb,
    	getStatisticsFromDb,
    	
    	function (err, users, messages, statistics) {
    	
    	    // an error occurred in any of those functions
    		if (err) throw err;
    	
    	    // do something with all that data
    	    console.log(users, data, logresult);
    	}
    );

## .Serial

The `.Serial` function allows you to sequentially execute functions that are provided. Use it like `Serial( f1, f2, .. fn )` whereas each function should expect an argument `error` as first argument and call `this(error, args)` once it's ready.

Each function has to expect an `error` as first argument; Any other can be designed as you wish. If an error occurs in any of the functions, the last function in the list will be called directly - skipping the functions in between. This means that you only need to throw errors in the last function.

	var Serial = require('./lib/flow').Serial;
	
	Serial(
		function () {
			// call next function, no error, two arguments
			this(null, 'dog', 'green');
		},
		function (err, animal, color) {
			// output provided data
			console.log('Animal:', animal, color);
			var result = 'A ' + color + ' ' + animal + ' is a funny animal.';
			this(null, result);
		},
		function (err, sentence) {
			if (err) return console.log('An error occurred:', err);
			console.log('Sentence:', sentence);	
			//this(null);	
		}
	);

## .Queue

`Queue` is a class which executes functions that are designed to take longer sequentially. Use `var MyQueue = new require('./kloflow').Queue()` and from thereon `MyQueue.add( [function () ] );`. The supplied function should call `this();` once it has finished in order to invode the next function in line.

	// include library
	var Queue = require('./lib/flow').Queue;
	
	// create new queue object
	var MyQueue = new Queue();
	
	// basic usage
	MyQueue.add(function() {
	    /* do something here */
		console.log('We DID something.');
		this();
	});
	
	// you can also supply arguments to 
	// that function when it's called:
	MyQueue.add( 'some_data', function (data) {
	    // output supplied data
	    console.log('We recieved data:', data);
	    
	    // next!
	    this();
	});
	
This example will run the two functions one after the other. Use a `setTimeout(this, 1000)` in a queue item if you want to test functions that take a long time.

When creating a Queue object, you may also provide a timeout in milliseconds that will skip to the next function in queue if the current one takes too long, i.e. `var MyQueue = new Queue(5000);` - Operations that take longer than 5000ms will be timed out. 

## TO DO

Add examples and tests.

## LICENSE

All code is licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).