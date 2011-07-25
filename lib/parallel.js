// Paralell execution function by Geerten van Meel
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



// Runs multiple functions in paralell and calls last function
// when all functions have run. Worker functions recieve one argument,
// a callable function next which expects an error or null as first
// argument and data as second argument.
// 
// The last function should expect an error or null as first argument
// and the resulting data from the three functions.

var exports = module.exports = function () {
	
	var output = [null]
	,	error = null
	,	n = arguments.length -1
	,	readyFunc = arguments[n];
	
	for (var i = 0; i < n+1; i++) 
	{
		// check if argument is really a function
		if (typeof(arguments[i]) !== 'function') 
			throw Error('All arguments must be functions!');
		
		// skip last item after verification
		if (i == n) break;

		// anonymous function for correct scoping
		(function (j, f) {
			// placeholder for output data
			output.push(null);
			
			// execute this function on next tick
			process.nextTick(function() {
				var cbF = function (err, data) {
					if (error) return;
					if (err) { error = err; return readyFunc(err); }
					output[j+1] = data;
					n--;
					if (n == 0) readyFunc.apply(this, output);
				};
				f.call(cbF, cbF);
			});
		})(i, arguments[i]);
	}
};