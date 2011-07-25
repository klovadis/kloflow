# Flow Control Library for Node.js

This is a self-written flow control library that currently exports three functions: `Parallel` execution, `Serial` execution and a `Queue` class which allows to add items constantly to the queue. 

It's easy to use and lightweight, but thorough testing is pending. There are many flow control libraries for [Node.JS](http://nodejs.org/) and JavaScript in general, but in order to get more into Node and server-side JavaScript, I created my own.

## Parallel

The export `.Parallel` allows you to run multiple functions in parallel and call a callback function once all of them have finished.

    // include the library
    var Parallel = require('./kloflow');
    
    // run two functions in parallel and call the last
    // function when all calculations are done or if
    // an error occurred.
    Parallel(
    	
        function (done) { 
        	/* function 1, do something async here */
        	
        	// call done(); once youre ready
        	next(done, 'data_1');
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

Usage: `Parallel ( [function (done) {}], function (err, f1Data, f2Data, ..) );` - Provide any amount of functions to `Parallel()`. Each of those functions will recieve an argument `done` when called, which is a callable `function (err, result)` which you should call once you're done.

The last function that is supplied however will be called once all the other functions have finished. It should expect the first argument to be an `error or null`, the next arguments will hold the values of the other functions that were called in their corresponding order. 