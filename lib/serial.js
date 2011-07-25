// Serial function by Geerten van Meel
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


// Run multiple functions one after the other. Call the next function 
// either by using this(null, args) or using next(null, args) if you
// define your function like function (err, args, next)

var exports = module.exports = function () {
	
	// get provided functions
	var functionList = []; // holds functions
	for (var i = 0; i < arguments.length; i++)
	{
		// validate input
		if (typeof(arguments[i]) !== 'function')
			throw Error('Arguments must be functions!');
			
		// add function to list
		functionList.push(arguments[i]);
	}	
	
	// well, nothing to do then
	if (functionList.length < 1) return;
	
	
	// helper function
	var nextCb = function (err) {
		// this should not happen unless user is stupid
		if (!functionList.length) return console.log('YOU STUPID?');
		
		// if an error occurred, call last function directly
		if (err) return functionList[functionList.length-1](err);

		// prepare arguments
		var args = []						// arguments for next function
		,	next = functionList.shift();	// next function
		for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
		args.push(nextCb); // add next() as last argument if users prefer that
		
		// call next function
		process.nextTick(function() { next.apply(nextCb, args); });
	}
	
	// begin working the list
	nextCb.call(nextCb, null);
};