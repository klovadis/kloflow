// Queue class by Geerten van Meel
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
/*
	Queue module / class
	
METHODS

	.add( [arg1, [arg2, [..] ] ], callback)
	
		Add a task to queue. Any arguments will be passed to callback
		when it's its turn.	The last argument must be a function
		that takes the arguments plus another callback 
		function 'next' which will make the class continue 
		with the next item in queue. this() will reference next as well.


	.clear()
		Clear all pending items in queue.
	
	
	.pause( [callback] )
		Optional function callback is called when current item in queue
		is done processing and the queue is actually paused.
	
	
	.resume()
		Resume working the queue.
		
MEMBERS:

	.length
		Holds the amount of pending events.
		
USAGE:

	var Queue = require('./queue.js');
	
	var myQueue = new Queue( [timeout_in_ms = 5000] );
	
	myQueue.add( some_data, more_data, function(some_data1, more_data1, next) {
	
		// do your thing here
		
		// use this to tell queue that the next item can be processed
		next();	
	});	
*/

var Queue = exports = module.exports = function (timeout) {
	
	// set members
	this.items = [];
	this.busy = false;
	this.paused = false;
	this.timeout = (typeof(timeout) == 'number') ? timeout : 5000;
	this.pauseCb = null;
};



// add an item to queue
// last argument must be a function
Queue.prototype.add = function (data, funcObj) {
	
	// do nothing if no arguments are here
	if (typeof(data) == 'undefined') return;
	
	// get callback function
	var funcObj = arguments[arguments.length-1];
	if (typeof(funcObj) != 'function') 
		throw Error('Last argument must be a worker function!');
		
	// add arguments to args
	var args = [];
	for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
	
	// add data to queue
	this.items.push(args);
	
	// attempt to execute next object in queue
	this.next();	
	
} // .add()



// execute next object
Queue.prototype.next = function () {
	
	// do nothing if queue is busy
	if (this.busy || this.paused) return;
	if (this.items.length == 0) return;
	
	// mark queue as busy
	this.busy = true;
	
	// get next item from queue
	var self = this
	,	tooLate = false				// set to true if the timeout is invoked
	,	args = this.items.shift()	// get next item in queue
	,	funcObj = args.pop();		// last in args is the worker function
	
	// callback to be called when task is done
	var nextCb = function () {
		// remove the timeout and continue with business
		if (nextTimeout !== null) clearTimeout(nextTimeout);
		if (tooLate) return console.log('Warning: Queued operation eventually continued after timeout.');
		self.busy = false;
		
		// deal with pause/resume and their callbacks
		if (!self.paused) return self.next();
		if (typeof(self.pauseCb) != 'function') return; 
		self.pauseCb(); 
		self.pauseCb = null;
	}
	
	// last or args is the above callback
	args.push(nextCb);
	
	// timeout function to avoid running dry
	if (this.timeout > 0)
	{
		var nextTimeout = setTimeout(function () {
			// this should not happen
			console.log('Warning: Queued operation timed out!');
			nextCb();
			tooLate = true;
		}, this.timeout);
	} else {
		// no timing out .. dangerous stuff ..
		nextTimeout = null;
	}
	
	// now actually run next object in queue
	funcObj.apply(nextCb, args);  
	
} // .next()



// pause working the queue
Queue.prototype.pause = function (callback) {
	
	// callback when pause is in place
	if (typeof(callback) == 'function') 
	{
		// we're already paused, callback on next tick
		if (this.paused) return process.nextTick(callback);
			
		// if we're busy, callback when we're done,
		// if not, do it on next tick
		if (this.busy) this.pauseCb = callback;
			else process.nextTick(callback);
	}
	
	// set paused to true, neglect if it's called twice
	this.paused = true;
	
} // .pause()



// resume working the queue
Queue.prototype.resume = function () {
	
	// note that queue was not paused
	if (!this.paused) return console.log('Queue was not paused.');	
	
	// resume working
	this.paused = false;
	this.next();
	
} // .resume()



// clears all items in queue
Queue.prototype.clear = function () {
	
	// log how many items were removed
	console.log(this.items.length + ' items have been removed from queue.');	
	
	// simply dump array
	this.items = [];
	
} // .clear()



// .length holds the length of the queue
Queue.prototype.__defineGetter__('length', function () { 
	return this.items.length; 
}); // .length

