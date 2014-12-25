(function ($) {

    /* TEMPORARY (?) FIX TO BUG IN d3. */

    function d3_filter(pred) {
        var subgroup, result, i, j;
        result = this.slice(0, this.length);
        result.__proto__ = this;
        for (i = 0; i < result.length; i += 1) {
            subgroup = result[i].slice(0, result[i].length);
            subgroup.__proto__ = result[i];
            result[i] = subgroup;
            for (j = 0; j < subgroup.length; j += 1) {
                if (subgroup[j] && !pred.call(subgroup[j], subgroup[j].__data__, j))
                    subgroup[j] = null;
            }
        }
        return result;
    }

    // FIXME: Get around missing function in d3 entering selections, and
    // brokenness of result of filter.
    d3.selection.enter.prototype.filter = d3_filter;

    /* GENERAL UTILITIES */

    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key))
                target[key] = source[key];
        }
        return target;
    }

    var A0 = 0xE66D;
    var A1 = 0x5DEEC0000;
    var C = 0xB;

    var B32 = 0x100000000, B48 = 0x1000000000000;

    function randomGenerator(seed) {
	var i;
	function advance() {
	    /* Compute (seed * A + C) mod 2**48 exactly, where A = A0+A1.  Since 
	     * A1 * seed1 is a multiple of 2**48, there is no need to compute
	     * it.  For the rest, we avoid rounding by restricting the number
	     * of significant bits in each term to <=52 bits. */
	    var seed0 = seed % B32;
	    var seed1 = seed - seed0;
	    seed = ((seed0 * A0) + (seed0 * A1) % B48
		    + (seed1 * A0) % B48 + C) % B48;
	    return seed / B48;
	}

        function next() {
            advance();
            return seed / B48;
        }

        function nextInt(bnd1, bnd2) {
            if (typeof bnd2 == 'undefined') {
                bnd2 = bnd1;
                bnd1 = 0;
            } 
            if (bnd1 >= bnd2)
                return NaN;
            return Math.floor(bnd1 + next() * (bnd2 - bnd1));
        }


	if (seed == null) {
	    seed = (new Date()).getTime();
	    for (i = 0; i < 10; i += 1)
		advance();
	}

	return { next: next, nextInt: nextInt };
    }

    // FIXME: A problem with use of barrier(), as implemented, is that recursion
    // depth is nondeterministic, unless one's Javascript implementation does
    // tail-recursion removal.  Unlike conventional barriers, we use (in effect)
    // continuation passing.  It is possible that the same thread calls all the
    // continuations in the sequence of barriers it encounters, in which case
    // stack depth can increase without bound.

    /** Returns a barrier that keeps a count of outstanding tasks, and 
     *  calls a designated continuation function when that count is reduced to 0.
     */
    function barrier() {
        var working = 0;
        var continuation = null;

        /** Increment the barrier count, indicating a new task to be completed 
         *  before the continuation is called. */
        function start() {
            if (working < 0)
                throw new Error("internal error: negative barrier count");

            working += 1;
        }

	function setContinuation(cont) {
	    continuation = cont;
	}

        /** Decrement the barrier count, calling the barrier's continuation
         *  function if the count reaches 0.  */
        function finish() {
            working -= 1;
            if (working < 0)
                throw new Error("internal error: negative barrier count");
            if (working == 0 && continuation) {
                continuation();
            }
        }

        /** Call finish(CONT) on the barrier after a delay of 
         *  DELAY milliseconds. */
        function finishAfterDelay(delay) {
            if (delay <= 0) {
                finish();
            }

            var timer = setTimeout(function () {
                finish();
                clearTimeout(timer);
            }, delay);
        }

        return {
            start: start,
	    setContinuation: setContinuation,
            finish: finish,
            finishAfterDelay: finishAfterDelay,
        };
    }

    function MARK() { }

    var MARKS = [ [MARK, MARK, 0, null, null],
                  [MARK, MARK, 1, null, null],
                  [MARK, MARK, 2, null, null],
                  [MARK, MARK, 3, null, null] ];

    /** A controller for recording, undoing, and replaying sequences of 
     *  operations. */
    function opPlayer() {
        var undoList = [];
        var undoIndex;
        var recording;
        undoIndex = -1;
        recording = true;

        /** @public */
        function setRecordingMode(value) {
            var old = recording;
            recording = value;
            return old;
        }

        /** @public */
        function markUndo (tag) {
            if (recording) {
                trimUndo();
                undoList.push(MARKS[tag || 0]);
                undoIndex += 1;
            }
        }

        /** @public */
        function undo() {
            if (undoIndex < 0)
                return false;
            undo1(undoList[undoIndex]);
            undoIndex -= 1;
            return true;
        }

        /** @public */
        function undoToMark(tag) {
            var wasAction;
            wasAction = undo();
            tag = tag || 0;
            
            while (undoIndex >= 0 
                   && (undoList[undoIndex][0] !== MARK
                       || undoList[undoIndex][2] > tag)) {
                wasAction = true;
                undo();
            }

            return wasAction;
        }

        /** @public */
        function undoAll() {
            while (undo()) {
	    }
        }

        /** @public */
        function redo() {
            if (undoIndex >= undoList.length - 1)
                return false;
            undoIndex += 1;
            redo1(undoList[undoIndex]);
            return true;
        }

        /** @public */
        function redoToMark(tag) {
            var wasAction;
            wasAction = redo();
            tag = tag || 0;
            
            while (undoIndex < undoList.length-1 
                   && (undoList[undoIndex][0] !== MARK
                       || undoList[undoIndex][2] > tag)) {
                wasAction = true;
                redo();
            }

            return wasAction;
        }

        /** @public */
        function redoAll() {
            while (redo()) {
	    }
        }

        /** @public */
        function trimUndo() {
            undoList.length = undoIndex + 1;
        }
        
        /** @public */
        function recordUndo(dofunc, undofunc, item, newargs, oldargs) {
            if (recording) {
		trimUndo();
                undoList.push([dofunc, undofunc, item, newargs, oldargs]);
		undoIndex += 1;
	    }
        }

        /** @private */
        function undo1(item) {
            var op = item[1], target = item[2], oldargs = item[4];
            var old = setRecordingMode(false);
            op.apply(target, oldargs);
            setRecordingMode(old);
        }

        /** @private */
        function redo1(item) {
            var op = item[0], target = item[2], newargs = item[3];
            var old = setRecordingMode(false);
            op.apply(target, newargs);
            setRecordingMode(old);
        }

        return {
            setRecordingMode: setRecordingMode,
            undo: undo,
            markUndo: markUndo,
            undoToMark: undoToMark,
	    undoAll: undoAll,
            redo: redo,
            redoToMark: redoToMark,
            redoAll: redoAll,
            trimUndo: trimUndo,
            recordUndo: recordUndo
        };
    }

    /** @public */
    function isIntLiteral(text) {
        return String(text).match(/^\d+$/);
    }

    /** @public */
    function isSignedIntLiteral(text) {
        return String(text).match(/^\-?\d+$/);
    }

    /** @public */
    function isNumeral(text) {
        return  String(text).match(/^\-?(\d+(\.\d*)?|\d*\.\d+)([eE][-+]\d+)?/);
    }

    /** @public */
    function updateInt(val, oldVal) {
        if (val.match(/^\s*-?\d+\s*$/))
            return Number(val);
        else
            return oldVal;
    }

    /** @public */
    function updateIntFromInput(elt, oldVal) {
        return updateInt($(elt).val(), oldVal);
    }

    /** @public */
    function controller() {
	var procs = [];
	function yield(interval, func) {
	    var i, k, entry;
	    var now = new Date().getTime();

	    if (func) {
		if (interval == null || interval <= 0)
		    procs.push({ when: now, 
				 f: func, args: yield.arguments });
		else
		    procs.push({ when: interval + now,
				 f: func, args: yield.arguments });
	    }

	    if (procs.length == 0)
		return;

	    k = 0;
	    for (i = 1; i < procs.length; i += 1) {
		if (procs[i].when <= procs[k].when)
		    k = i;
		break;
	    }
	    if (procs[i].when <= now) {
		entry = procs.splice(i, 1);
		entry.f.call(entry.args);
	    } else
		setTimeout(function () { yield(interval, func); },
			   procs[i].when - now + 1);
	}
	function schedule(interval, func) {
	    var now = new Date().getTime();

	    if (interval == null || interval <= 0)
		procs.push({ when: now, 
			     f: func, args: yield.arguments });
	    else
		procs.push({ when: interval + now,
			     f: func, args: yield.arguments });
	}

	return { yield: yield, schedule: schedule };
    }

    function DB(msg) {
        $("#log").append(msg + " // ");
    }

    function DBN(lbl, x) {
        if (x == null || isNaN(x)) DB(lbl);
    }

    function DISP(obj, n) {
	if (n == null)
	    n = 1;
	if (obj == null || typeof obj != 'object')
	    $("#log").append(obj);
	else {
	    if (n == 0)
		$("#log").append("...");
	    else {
		$("#log").append("{ ");
		for (var key in obj) 
		    if (obj.hasOwnProperty(key)) {
			$("#log").append(key + ": ");
			DISP(obj[key], n-1);
			$("#log").append(", ");
		    }
		$("#log").append("} ");
	    }
	}
    }

    /** public */
    function updateOptions(obj, options, defaults, setDefaultValue) {
        for (var opt in defaults) {
            if (defaults.hasOwnProperty(opt)) {
                if (options == null || options[opt] === undefined) {
	            if (setDefaultValue)
		        obj[opt] = defaults[opt];
                } else
                    obj[opt] = options[opt];
            }
        }
        
        return obj;
    }

    RTN = ("\r").charCodeAt(0);

    function setKeyInput(elementName, callback, clear) {
        var element = $(elementName);
        element.keypress(function (evnt) {
            if (evnt.which == RTN) {
                var result = callback(element, element.val());
                if (clear != null)
                    element.val(clear);
                return result;
            } else
                return true;
        });
    }

    if (typeof demos == 'undefined') {
        demos = { 
            barrier: barrier,
	    randomGenerator: randomGenerator,
            isIntLiteral: isIntLiteral,
            isSignedIntLiteral: isSignedIntLiteral,
            isSignedIntLiteral: isSignedIntLiteral,
            isNumeral: isNumeral,
            updateInt: updateInt,
            updateIntFromInput: updateIntFromInput,
            extend: extend,
            updateOptions: updateOptions,
            opPlayer: opPlayer,
            setKeyInput: setKeyInput,
	    DISP: DISP,
            DB: DB,
            DBN: DBN
        };
    }


})(jQuery);
