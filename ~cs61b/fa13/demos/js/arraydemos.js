
(function () {

    var randomGenerator = demos.randomGenerator;
    var updateInt = demos.updateInt;
    var updateIntFromInput = demos.updateIntFromInput;
    var isIntLiteral = demos.isIntLiteral;
    var opPlayer = demos.opPlayer;
    var updateOptions = demos.updateOptions;
    var setKeyInput = demos.setKeyInput;
    var DISP = demos.DISP;
    var DB = demos.DB;
    var DBN = demos.DBN;

    /** Number of inversions in A[LOW .. HIGH-1].  LOW defaults to 0 and 
     *  HIGH to A.length-1.
     *  @public */
    function inversions(A, low, high) {
        var i, j, c;
        low = (low == null) ? 0 : low;
        high = (high == null) ? A.length : high;
        c = 0;
        for (i = low+1; i < high; i += 1) {
            for (j = 0; j < i; j += 1) {
                if (A[j] > A[i])
                    c += 1;
            }
        }
        return c;
    }

    /** Swap A[i] and A[j]. 
     * @public */
    function swap(A, i, j) {
	var tmp = A[i];
	A[i] = A[j];
	A[j] = tmp;
    }

    /** @private */
    function applyStyle(sel, styleParams) {
        for (key in styleParams) {
	    if (styleParams.hasOwnProperty(key)) {
                sel.attr(key, styleParams[key]);
	    }
	}
    }

    var ALL_PLACES = { "n": true, "s": true, "w": true, "e": true,
                       "nw": true, "sw": true, "ne": true, "se": true };

    function arrayViewer(parent, tag, params) {
        /** @public */
        function configure(options) {
            setParameters(options, false);
        }
            
        /** @public */
        function getEltHeight() {
            return eltHeight;
        }

        /** @public */
        function getEltWidth() {
            return eltWidth;
        }

        /** @public */
        function getEltStyle() {
            return eltStyle;
        }

        /** @public */
        function getEltTextStyle() {
            return eltTextStyle;
        }

        /** @public */
        function getEltTextHeight() {
            return eltTextHeight;
        }

        /** @public */
        function getLabelTextHeight() {
            return labelTextHeight;
        }

        /** @public */
        function isHorizontal() {
            return horizontal;
        }

        /** @public */
        function getLabelStyle() {
            return labelStyle;
        }

        /** @public */
        function getLabelSep() {
            return labelSep;
        }

        /** @public */
	function getX(k) {
            var d, i;
            if (horizontal) {
                d = k * eltWidth;
                for (i = 0; i <= k; i += 1)
                    d += gaps[i] || 0;
                return d;
            } else {
                return 0;
            }
	}

        /** @public */
	function getY(k) {
            var d, i;
            if (horizontal) {
                return 0;
            } else {
                d = k * eltWidth;
                for (i = 0; i <= k; i += 1)
                    d += gaps[i] || 0;
                return d;
            }
	}

        /** @public */
        function getArray() {
            return arr;
        }

        /** @public */
        function getLowIndex() {
            return low == null ? 0 : low;
        } 
        
        /** @public */
        function getHighIndex() {
            return high == null ? arr.length-1 : high;
        }

        /** @public */
        function addLabel(position, index, text, textSep, style) {
            if (ALL_PLACES[position] !== true)
                throw new Error("Bad position: " + position);
            uid += 1;
            style = style || labelStyle;
            if (textSep == null) 
                textSep = labelSep;
            var lbl = { position: position, index: index, text: text,
                        style: style, sep: textSep, uid: String(uid) };
            labels.push(lbl);
            return lbl;
        }

        /** @public */
        function removeLabels() {
            labels.length = 0;
            return this;
        }

        /** @public */
        function removeLabel(lbl) {
            var i;
            for (i = 0; i < labels.length; i += 1) {
                if (labels[i] === lbl) {
                    var val = labels[i];
                    labels[i] = labels[labels.length-1];
                    labels.pop();
                    break;
                }
            }
            return this;
        }

        /** @public */
        function getGaps() {
            return gaps;
        }

        /** @public */
        function update() {
            var i;
            if (arr === null)
                return;
            var L = low || 0, H = (high == null) ? arr.length-1 : high;
            var A;

            if (L == 0 && H == arr.length-1)
                A = arr;
            else {
                A = [];
                for (i = L; i <= H; i += 1)
                    A.push(arr[i]);
            }

	    translate(d3.select(sel), x0, y0);
            updateBoxes(d3.select(eltsGroupSel), A);
            updateLabels(d3.select(labelsGroupSel));
            return this;
	}

        var arr;
        var gaps = [];
        var labels = [];
        var uid; uid = 0;

        var sel = "#" + tag;
	var labelsTag = tag + "-labels";
	var eltsTag = tag + "-elts";
        var labelsGroupSel = "#" + labelsTag;
        var eltsGroupSel = "#" + eltsTag;

        var unit, eltHeight, eltWidth, horizontal, eltStyle, eltTextStyle;
        var eltTextHeight, eltText, labelTextHeight, labelStyle, labelSep;
        var x0, y0, low, high;
        
        /** @private */
        function translate(S, x, y) {
            if (x != null || y != null) {
                x = x || 0;
                y = y || 0;
                S.attr("transform", 
                       "translate(" + x * unit + "," + y * unit + ")");
            }
        }

        /** @private */
        function updateBoxes(G, A) {
            var S;

	    S = G.selectAll("g").data(A);
            S.exit().remove()
            S = S.enter().append("g");
            S.append("rect");
            S.append("text");

            S = G.selectAll("g").data(A)
                .each(function (d, i) { 
                    translate(d3.select(this), getX(i), getY(i)); });
            S.select("rect")
                .attr("width", eltWidth * unit)
                .attr("height", eltHeight * unit)
                .call(applyStyle, eltStyle);
            S.select("text")
                .attr("x", eltWidth * 0.5 * unit)
                .attr("y", (eltHeight * unit + eltTextHeight) * 0.5)
                .attr("text-anchor", "middle")
                .call(applyStyle, eltTextStyle)
                .text(eltText);
        }

        /** @private */
        function updateLabels(S) {
            function labelKey(L) {
                return L.uid;
            }

            S = S.selectAll("text").data(labels, labelKey);
            S.exit().remove();
            S.enter().append("text").each(labelAttr);
            S.each(labelAttr);
        }

        /** @private */
	function labelAttr(lbl, i) {
            var sel = d3.select(this);

            var ht = eltHeight * unit;
            var wid = eltWidth * unit;

	    var x, y, anchor;
            var ulx, uly, lrx, lry;
            if (lbl.index == null) {
                var h = (high == null ? arr.length - 1 : high) - (low || 0);
                ulx = getX(0) * unit;
                uly = getY(0) * unit;
                lrx = getX(h) * unit + wid;
                lry = getY(h) * unit + ht;
            } else {
	        ulx = getX(lbl.index) * unit;
	        uly = getY(lbl.index) * unit;
	        lrx = getX(lbl.index) * unit + wid;
	        lry = getY(lbl.index) * unit + ht;
            }

	    switch (lbl.position) {
	    case "n":
		x = (ulx + lrx) * 0.5;
		y = uly - lbl.sep;
		anchor = "middle";
		break;
	    case "s":
		x = (ulx + lrx) * 0.5;
		y = lry + lbl.sep + labelTextHeight;
		anchor = "middle";
		break;
	    case "w":
		x = ulx - lbl.sep;
		y = (uly + lry + labelTextHeight) * 0.5;
		anchor = "end";
		break;
	    case "e":
		x = lrx + lbl.sep;
		y = (uly + lry + labelTextHeight) * 0.5;
		anchor = "start";
		break;
	    case "ne":
		if (horizontal) {
		    x = lrx;
		    y = uly - lbl.sep;
		    anchor = "end";
		} else {
		    x = lrx + lbl.sep;
		    y = uly + (ht + labelTextHeight) * 0.5;
		    anchor = "start";
		}
		break;
	    case "nw":
		if (horizontal) {
		    x = ulx;
		    y = uly - lbl.sep;
		    anchor = "start";
		} else {
		    x = ulx - lbl.sep;
		    y = uly + (ht + labelTextHeight) * 0.5;
		    anchor = "end";
		}
		break;
	    case "sw":
		if (horizontal) {
		    x = ulx;
		    y = lry + lbl.sep + labelTextHeight;
		    anchor = "start";
		} else {
		    x = ulx - lbl.sep;
		    y = lry - (ht - labelTextHeight) * 0.5;
		    anchor = "end";
		}
		break;
	    case "se":
		if (horizontal) {
		    x = lrx;
		    y = lry + lbl.sep + labelTextHeight;
		    anchor = "end";
		} else {
		    x = lrx + lbl.sep;
		    y = lry - (ht - labelTextHeight) * 0.5;
		    anchor = "start";
		}
		break;
	    default:
		throw new Error("bad label position");
	    }
	    sel.attr("x", x).attr("y", y).attr("text-anchor", anchor);
            applyStyle(sel, lbl.style);
            sel.text(lbl.text);
	}

        /** @private */
        function setParameters(params, useDefaults) {
            function opt(name, prev, dflt) {
                if (typeof params[name] == "undefined")
                    return useDefaults ? dflt : prev;
                else
                    return params[name];
            }

            params = typeof params == "undefined" ? {} : params;
            unit = opt("unit", unit, 90.7);
            x0 = opt("x", x0, null);
            y0 = opt("y", y0, null);
            arr = opt("array", arr, null);
            low = opt("low", low, null);
            high = opt("high", high, null);
            eltHeight = opt("eltHeight", eltHeight, 0.3);
            eltWidth = opt("eltWidth", eltWidth, 0.3);
            horizontal = opt("horizontal", horizontal, true);
            eltStyle = opt("eltStyle", eltStyle,
                              { fill: "none",
                                "stroke-width": 1,
                                stroke: "black" });
            labelSep = opt("labelSep", labelSep, 14);
            eltTextHeight = opt("eltTextHeight", eltTextHeight, 14);
            eltTextStyle = 
                opt("eltTextStyle", eltTextStyle, 
                    { "class": "array-element-text" });
            labelStyle = 
                opt("labelStyle", labelStyle, { "class": "array-label" });
            labelTextHeight = opt("labelTextHeight", labelTextHeight, 14);
            eltText = opt("eltText", eltText, 
                          function (d, i) { 
                              return d == null ? "" : String(d); 
                          });
        }

        setParameters(params, true);

	d3.select(parent).selectAll(sel).data([0]).enter()
	    .append("svg:g").attr("id", tag);
	var S = d3.select(sel);
	translate(S, x0, y0);
	    
	S.selectAll(eltsGroupSel).remove();
	S.selectAll(labelsGroupSel).remove();
        S.append("g").attr("id", eltsTag);
        S.append("g").attr("id", labelsTag);

        return {
            configure: configure,
            getEltHeight: getEltHeight,
            getEltWidth: getEltWidth,
            getEltStyle: getEltStyle,
            getEltTextStyle: getEltTextStyle,
            getEltTextHeight: getEltTextHeight,
            getLabelTextHeight: getLabelTextHeight,
            isHorizontal: isHorizontal,
            getLabelStyle: getLabelStyle,
            getLabelSep: getLabelSep,
            getX: getX,
            getY: getY,
            getArray: getArray,
            getLowIndex: getLowIndex,
            getHighIndex: getHighIndex,
            addLabel: addLabel,
            removeLabels: removeLabels,
            removeLabel: removeLabel,
            getGaps: getGaps,
            update: update,
        };

    }

    if (typeof arraydemos == "undefined") {
	arraydemos = {
	    randomGenerator: randomGenerator,
	    swap: swap,
            updateInt: updateInt,
            updateIntFromInput: updateIntFromInput,
            arrayViewer: arrayViewer,
            inversions: inversions,
            setKeyInput: setKeyInput,
	    DISP: DISP,
            DB: DB,
            DBN: DBN
	};
    }

})();
