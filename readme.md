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
    var Parallel = require('./kloflow');
    
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
