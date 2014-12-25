(function($){
    var ad = arraydemos;
    var DB = ad.DB;
    var DISP = ad.DISP;
    var swap = ad.swap;
    var views = [];
    var dataDigits;

    var input = [];
    var inputView;
    var demo;

    var G = ad.randomGenerator();

    var NEUTRAL_COLOR = "#eeeeee";
    var DATA_ELT_STYLE =  { stroke: "black", 
                            'stroke-width': 1, 
                            fill: function (d, i) { return colorSelect(d, i); },
                          };
    var VAR_ELT_STYLE =   { stroke: "black", 
                            'stroke-width': 1, 
                            fill: NEUTRAL_COLOR,
                          };
    var UNSORTED_COLOR = "#ffcccc";
    var GT_COLOR  = "#66ff66";
    var LT_COLOR  = "#ff66ff";
    var GAP = 0.04;
    var colorSelect0 = function () { return NEUTRAL_COLOR; };
    
    var colorSelect;
    colorSelect = colorSelect0;

    function registerView(view) {
        views.push(view);
    }

    function syncView() {
        var i;
        for (i = 0; i < views.length; i += 1) 
            views[i].update();
    }

    function clear(A) {
        var i;
        A.length = input.length;
        for (i = 0; i < A.length; i += 1)
            A[i] = input[i];
    }

    function indexArray(view) {
	var i, N = view.getArray().length;
	for (i = 0; i < N; i += 1)
	    view.addLabel('s', i, i, 4, 
			  { "class": "small-array-label" });
    }

    function getInputSize() {
	var inputSize;
        var sz = $("#input-size").val();
	if (sz.match(/^\d+$/))
            inputSize = Math.max(Number(sz), 1);
	$("#input-size").val(String(inputSize));
	return inputSize;
    }

    dataDigits = null;
    function setDataLength(k) {
	dataDigits = k;
    }

    function maxInputVal() {
	if (dataDigits == null) 
	    return getInputSize() - 1;
	else
	    return Math.pow(10, dataDigits) - 1;
    }

    function makeInput(i) {
	if (dataDigits == null)
	    return i;
	else
	    return String(Math.pow(10, dataDigits) + i).substring(1);
    }

    function setIncreasingInput() {
        var i;
	var inputSize = getInputSize();
	var mult = Math.max(1, Math.floor((maxInputVal() + 1) / inputSize));
        input.length = 0;
        for (i = 0; i < inputSize; i += 1) {
	    input.push(makeInput(i*mult));
        }
        syncView();
    }

    function setDecreasingInput() {
        var i;
	var inputSize = getInputSize();
	var mult = Math.max(1, Math.floor((maxInputVal() + 1) / inputSize));
        input.length = 0;
        for (i = inputSize-1; i >= 0; i -= 1) {
            input.push(makeInput(i*mult));
        }
        syncView();
    }

    function setRandomInput() {
	var inputSize = getInputSize();
        setIncreasingInput();

        var i, k, tmp;
        for (i = input.length-1; i > 0; i -= 1) {
            k = G.nextInt(0, i+1);
            swap(input, k, i);
        }
        syncView();
    }

    function runDemo(id) {
	clear(demo.A);
        if (demo.inv)
            demo.inv[0] = ad.inversions(demo.A);
	demo.opcount[0] = 0;
        syncView();
        enableInteraction(false);
	demo.func(id);
    }

    function commonSetup(wid) {
        wid = wid || 0.25;
        inputView = ad.arrayViewer("#disp", "input1", 
                                   { array: input,
                                     eltHeight: 0.25, eltWidth: wid,
                                     eltStyle: VAR_ELT_STYLE,
                                   });
        registerView(inputView);

        ad.setKeyInput("#input-size", function (elt, val) {
            var sz = $("#input-size").val();
	    if (sz.match(/^\d+$/))
                inputSize = Number(sz);
            return false;
        });

        $("#menu").menu({
            position: { my: "top", within: "#parameters",  },
            select: function (event, ui) {
                var id = ui.item.attr('id');
                switch (id) {
                case "increasing":
                    setIncreasingInput();
                    break;
                case "decreasing":
                    setDecreasingInput();
                    break;
                case "random": 
                    setRandomInput();
                    break;
		case "Run": case "Run1": case "Run2": case "Run3":
		    runDemo(id);
                    break;
                default:
                    break;
                }
                return;
            }
        });
        $("#menu a").on("click", function (event) {
            event.preventDefault();
        });

        $("#animationSpeed").slider({ orientation: "horizontal", 
                                      animate: true,
                                      min: 0, max: 15, step: 1, 
                                      value: 5 });
        enableInteraction(true);


        $("#input-size").val("14");
        setRandomInput();

        syncView();
    }

    function enableInteraction(val) {
	if (typeof val == 'undefined')
	    val = true;

        $("#menu").menu({ disabled: !val });
    }

    function animationSpeed() {
        var time = $("#animationSpeed").slider("value");
        if (time == 0)
            return 10;
        else
            return time * 100;
    }

    function step(func) {
        var i, vals;
        var interval = animationSpeed();
        vals = [];
        syncView();
        for (i = 1; i < step.arguments.length; i += 1)
            vals.push(step.arguments[i]);
        setTimeout(function () { func.apply(null, vals); }, interval);
    }

    function getPointers(view) {
        var ptrs = [];
        return function set(P) {
            var i;
            for (i = 0; i < ptrs.length; i += 1)
                view.removeLabel(ptrs[i]);
            ptrs.length = 0;

            if (typeof P != 'object')
                P = set.arguments;

            for (i = 0; i < P.length; i += 1)
                ptrs[i] = view.addLabel("n", P[i], "V",
                                        2, { "class": "small-array-label" });
        }
    }                

    function insertionSort(A, dataView, opcount, inv, cont, m, phase) {
        var n, k;

        m = m == null ? 1 : m;
        phase = phase == null ? 0 : phase;

        colorSelect = function (v, i) {
            if ((i - phase) % m != 0) 
                return NEUTRAL_COLOR;
            else if (n !== null && i >= n+1 && i < A.length)
                return UNSORTED_COLOR;
            else if (k !== null && i >= k && i <= n)
                return GT_COLOR;
            else
                return NEUTRAL_COLOR;
        };
        
        function sort() {

            function insert() {
		if (k > 0)
		    opcount[0] += 1;
                if (k >= m && A[k-m] > A[k]) {
                    swap(A, k, k-m);
                    inv[0] = ad.inversions(A);
                    k -= m;
                    step(insert);
                } else {
                    k = null;
                    n += m;
                    step(sort);
                }
            }

            if (n < A.length) {
                k = n;
                step(insert);
            } else {
                n = k = null;
                syncView();
                cont();
            }

            
        }

        n = phase + m;
        k = null;
        sort();
    }

    function insertionSortDemo() {
        var A = [];
        var i, j;
        var inv = [0];
	var opcount = [0];
        var dataView, invView, opView;

        dataView = ad.arrayViewer("#disp", "data-is",
                                  { array: A,
                                    eltHeight: 0.25, eltWidth: 0.25,
                                    eltStyle: DATA_ELT_STYLE,
                                  });
        registerView(dataView);
        invView = ad.arrayViewer("#disp", "inv-is", 
                                 { array: inv,
                                   eltHeight: 0.25, eltWidth: 0.4,
                                   eltStyle: VAR_ELT_STYLE });
        registerView(invView);
        opView = ad.arrayViewer("#disp", "op-is", 
                                { array: opcount,
                                  eltHeight: 0.25, eltWidth: 0.4,
                                  eltStyle: VAR_ELT_STYLE });
        registerView(opView);

	demo = { A: A, inv: inv, opcount: opcount, 
		 func: function () { insertionSort(A, dataView, opcount, inv,
						   enableInteraction); },
	};

        inv[0] = '';
	opcount[0] = '';
        clear(A);
	syncView();
    }

    function shellsortDemo() {
        var A = [];
        var i, j;
        var inv = [0];
	var opcount = [0];
        var dataView, invView, opView;

        function lgexp(x) {
            var y, m;
            m = 1;
            y = 0;
            while (2*m <= x) {
                m *= 2;
                y += 1;
            }
            return m;
        }

        function shellsort(cont) {
            var setPtrs = getPointers(dataView);

            function sortSize(M, k) {
                if (k >= M) {
                    if (M == 1) {
                        setPtrs();
                        step(cont);
                    } else {
                        step(sortSize, (M+1) / 2 - 1, 0);
                    }
                } else {
                    var i, Q = [];
                    for (i = k; i < A.length; i += M)
                        Q.push(i);
                    setPtrs(Q);

                    insertionSort(A, dataView, opcount, inv, 
                                  function () { sortSize(M, k+1); },
                                  M, k);
                }
            }

            sortSize(lgexp(A.length)-1, 0);
        }

        dataView = ad.arrayViewer("#disp", "data-sh",
                                  { array: A,
                                    eltHeight: 0.25, eltWidth: 0.25,
                                    eltStyle: DATA_ELT_STYLE,
                                    labelSep: 8,
                                  });
        registerView(dataView);
        invView = ad.arrayViewer("#disp", "inv-sh", 
                                 { array: inv,
                                   eltHeight: 0.25, eltWidth: 0.4,
                                   eltStyle: VAR_ELT_STYLE });
        registerView(invView);
        opView = ad.arrayViewer("#disp", "op-sh", 
                                { array: opcount,
                                  eltHeight: 0.25, eltWidth: 0.4,
                                  eltStyle: VAR_ELT_STYLE });
        registerView(opView);

	demo = { A: A, inv: inv, opcount: opcount, 
		 func: function () { shellsort(enableInteraction); },
	};

        inv[0] = '';
	opcount[0] = '';
        clear(A);
	syncView();
    }

    function selectionSortDemo() {
        var A = [];
        var i, j;
        var inv = [0];
	var opcount = [0];
        var dataView, invView, opView;

        function selectionSort(cont) {
            var k, m, n;

            colorSelect = function (d, i) {
                if (n !== null && i >= k && i >= m+1 && i <= n)
                    return UNSORTED_COLOR;
                else if (k !== null && i >= 0 && i < k)
                    return GT_COLOR;
                else 
                    return NEUTRAL_COLOR;
            }

            function annotate() {
                dataView.removeLabels();
                if (k != null)
                    dataView.addLabel('n', m, "V"); 
            }


            function sort() {
                function find() {
		    if (k > n) {
		        swap(A, n, m);
                        inv[0] = ad.inversions(A);
                        n -= 1;
                        annotate();
		        step(sort);
		        return;
		    } else {
		        opcount[0] += 1;
                        if (A[k] > A[m])
		            m = k;
                        k += 1;
                        annotate();
		        step(find);
                    }
                }

                if (n > 0) {
                    m = 0; k = 1;
                    annotate();
                    step(find);
                } else {
                    n = m = k = null;
                    annotate();
                    step(cont);
                }
            }

            n = A.length-1;
            sort();
        }

        dataView = ad.arrayViewer("#disp", "data-ss",
                                  { array: A,
                                    eltHeight: 0.25, eltWidth: 0.25,
                                    eltStyle: DATA_ELT_STYLE,
				    labelSep: 8,
				  });
        registerView(dataView);
        invView = ad.arrayViewer("#disp", "inv-ss", 
                                 { array: inv,
                                   eltHeight: 0.25, eltWidth: 0.4,
                                   eltStyle: VAR_ELT_STYLE });
        registerView(invView);
        opView = ad.arrayViewer("#disp", "op-ss",
                                { array: opcount,
                                  eltHeight: 0.25, eltWidth: 0.4,
                                  eltStyle: VAR_ELT_STYLE });
        registerView(opView);	

	demo = { A: A, inv: inv, opcount: opcount, 
		 func: function () { selectionSort(enableInteraction); },
	       };

        inv[0] = '';
	opcount[0] = '';
        clear(A);
	syncView();
    }

    function quicksortDemo() {
        var A = [];
        var i, j;
        var inv = [0];
	var opcount = [0];
        var dataView, invView, opView;
        var partitionCount;

        function quicksort(cont) {
	    var threshold = Math.max(1,
                                     ad.updateIntFromInput("#qsthreshold", 4));
	    $("#threshold").val(String(threshold));
	    var phaseLbl = dataView.addLabel("s", null, "");
            partitionCount = 0;
	    var work = [];
            var i, j, k;

            function sort() {
                var task;
                var low, high;
                var setPtrs = getPointers(dataView);
                
                colorSelect = colorSelect0;

                function pivot() {
                    var M;

                    function select() {
                        opcount[0] += 2;
                        if (A[low] <= A[M]) {
                            if (A[M] <= A[high]) 
                                swap(A, low, M);
                            else {
                                opcount[0] += 1;
                                if (A[low] <= A[high])
                                    swap(A, low, high);
                            }
                        } else if (A[low] > A[high]) {
                            opcount[0] += 1;
                            if (A[M] <= A[high]) 
                                swap(A, low, high);
                            else
                                swap(A, low, M);
                        } 
                        setPtrs(low);
                        inv[0] = ad.inversions(A);
                        step(partition);
                    }

                    M = Math.floor((low + high) / 2);
                    setPtrs(low, M, high);
                    step(select);
                }

                function partition() {
                    var left, k, piv;
                    
                    colorSelect = function (d, i) {
                        if (i == piv)
                            return NEUTRAL_COLOR;
                        if (i >= low && i <= left)
                            return LT_COLOR;
                        if (i >= left+1 && i < k)
                            return GT_COLOR;
                        if (i >= k && i <= high)
                            return UNSORTED_COLOR;
                        return NEUTRAL_COLOR;
                    }

                    function advance() {
                        if (k > high) {
                            swap(A, low, left);
                            piv = low;
                            inv[0] = ad.inversions(A);
                            setPtrs(left);
                            step(makePartitions);
                        } else if (A[k] >= A[low]) {
                            opcount[0] += 1;
                            k += 1;
                            step(advance);
                        } else {
                            opcount[0] += 1;
                            left += 1;
                            swap(A, left, k);
                            inv[0] = ad.inversions(A);
                            k += 1;
                            step(advance);
                        }
                    }

                    function makePartitions() {
                        setPtrs();
                        if (left != low) {
                            partitionCount += 1;
			    dataView.getGaps()[left] = GAP
                        }
                        if (left != high) {
                            partitionCount += 1;
			    dataView.getGaps()[left+1] = GAP;
                        }
                        if (left - low > threshold)
                            work.push([low, left-1]);
                        if (high - left > threshold) 
                            work.push([left+1, high])
                        step(sort);
                    }

                    piv = low;
                    left = low;
                    k = low+1;
                    step(advance);
                }

                if (work.length == 0) {
		    dataView.getGaps().length = 0;

		    if (threshold > 1) {
                        phaseLbl.text = "Insertion-sorting phase";
			insertionSort(A, dataView, opcount, inv, 
				      function () { 
					  dataView.removeLabels();
					  cont();
				      });
		    } else {
			dataView.removeLabels();
			syncView();
			cont(); 
		    }
                } else {
                    task = work.pop();
                    low = task[0];
                    high = task[1];
                    if (high - low + 1 <= threshold)
                        sort();
                    pivot();
                }
            }

            phaseLbl.text = "Partitioning phase";
	    work.push([0, A.length-1]);
	    sort();
        }

        dataView = ad.arrayViewer("#disp", "data-qs", 
                                  { array: A,
                                    eltHeight: 0.25, eltWidth: 0.25,
                                    eltStyle: DATA_ELT_STYLE,
                                  });
        registerView(dataView);
        invView = ad.arrayViewer("#disp", "inv-qs", 
                                 { array: inv,
                                   eltHeight: 0.25, eltWidth: 0.4,
                                   eltStyle: VAR_ELT_STYLE });
        registerView(invView);
        opView = ad.arrayViewer("#disp", "op-qs", 
                                { array: opcount,
                                  eltHeight: 0.25, eltWidth: 0.4,
                                  eltStyle: VAR_ELT_STYLE });
        registerView(opView);

	demo = { A: A, inv: inv, opcount: opcount,
		 func: function () { quicksort(enableInteraction); },
	       };

        $("#qsthreshold").val("4");
	opcount[0] = '';
        clear(A);
	syncView();
    }

    function heapsortDemo() {
        var A = [];
        var i, j;
	var opcount = [0];
        var dataView, opView;

        function heapsort(cont) {
            var stage = dataView.addLabel("s", null, "");
            var setPtrs = getPointers(dataView);
            var heap0, heapEnd, needsReheap;

            function getParent(k) {
                return Math.floor((k-1) / 2);
            }
            function getKids(k) {
                return 2*k + 1;
            }

            function get(k) {
                if (k > heapEnd) 
                    return -Infinity;
                else
                    return A[k];
            }

            colorSelect = function (k, i) {
                if (needsReheap !== null) {
                    if (0 <= i && i < heap0)
                        return UNSORTED_COLOR;
                    if (i == needsReheap)
                        return UNSORTED_COLOR;
                    if (heap0 <= i && i < needsReheap)
                        return GT_COLOR;
                    if (needsReheap < i && i <= heapEnd)
                        return GT_COLOR;
                    else
                        return NEUTRAL_COLOR;
                } else if (0 <= i && i < heap0)
                    return UNSORTED_COLOR;
                else if (heap0 <= i && i <= heapEnd)
                    return GT_COLOR;
                else
                    return NEUTRAL_COLOR;
            }
                    
            function annotate() {
                var k;
                if (needsReheap !== null) {
                    k = getKids(needsReheap);
                    if (k+1 <= heapEnd)
                        setPtrs(needsReheap, k, k+1);
                    else if (k <= heapEnd)
                        setPtrs(needsReheap, k);
                    else
                        setPtrs(needsReheap);
                } else 
                    setPtrs();
            }

            function sift(cont, lbl) {
                var k = getKids(needsReheap);
                stage.text = lbl;
                var v0 = get(k), v1 = get(k+1);
                if (v1 > -Infinity) {
                    opcount[0] += 2;
                    setPtrs(needsReheap, k, k+1);
                }
                else if (v0 > -Infinity) {
                    opcount[0] += 1;
                    setPtrs(needsReheap, k);
                }
                if (v0 > v1) {
                    if (v0 > A[needsReheap]) {
                        swap(A, k, needsReheap);
                        needsReheap = k;
                        annotate();
                        step(sift, cont, lbl);
                        return;
                    }
                } else {
                    if (v1 > A[needsReheap]) {
                        swap(A, k+1, needsReheap);
                        needsReheap = k+1;
                        annotate();
                        step(sift, cont, lbl);
                        return;
                    }
                }
                needsReheap = null;
                cont();
            }
                        
            function heapify() {
                function heapify1() {
                    annotate();
                    if (heap0 == 0)
                        sort();
                    else {
                        needsReheap = heap0 -= 1;
                        annotate();
                        step(sift, heapify1, "Heapify");
                    }
                }

                stage.text = "Heapify";
                heapEnd = heap0 - 1;
                heap0 = getParent(heapEnd)+1;
                step(heapify1);
            }
            function sort() {
                dataView.getGaps().length = 0;
                if (heapEnd == 0) {
                    heapEnd = -1;
                    dataView.removeLabels();
                    colorSelect = colorSelect0;
                    step(cont);
                } else {
                    swap(A, 0, heapEnd);
                    heapEnd -= 1;
                    needsReheap = 0;
                    dataView.getGaps()[heapEnd + 1] = GAP;
                    stage.text = "Sorting: select largest";
                    annotate();
                    step(sift, sort, "Sorting: reheapify");
                }
            }

            heap0 = A.length;
            heapEnd = A.length-1;
            needsReheap = null;
            heapify();
        }

        dataView = ad.arrayViewer("#disp", "data-hs",
                                  { array: A,
                                    eltHeight: 0.25, eltWidth: 0.25,
                                    eltStyle: DATA_ELT_STYLE,
				    labelSep: 8,
				  });
        registerView(dataView);
        opView = ad.arrayViewer("#disp", "op-hs", 
                                { array: opcount,
                                  eltHeight: 0.25, eltWidth: 0.4,
                                  eltStyle: VAR_ELT_STYLE });
        registerView(opView);	

	demo = { A: A, opcount: opcount, 
		 func: function () { heapsort(enableInteraction); },
	       };

	opcount[0] = '';
        clear(A);
	syncView();
    }

    function mergesortDemo() {
        var A = [];
        var merged = [];
        var segments = [];
        var i, j;
	var opcount = [0];
        var dataView, mergedView, opView;

        function sourceVisible(i) {
            var j;
            for (j = 0; j < segments.length; j += 2)
                if (i >= segments[j+1] && i < segments[j+2]) {
                    return true;
                }
            return false;
        }

        function targetVisible(i) {
            var j;
            for (j = 2; j < segments.length; j += 4)
                if (i >= segments[j-2] && 
                    i < segments[j-1] + segments[j+1] - segments[j])
                    return true;
            return false;
        }

        var MERGE_DATA_ELT_STYLE =  
            { stroke: "black",
              'stroke-width': 1, 
              fill: function (d, i) { 
                return sourceVisible(i) ? NEUTRAL_COLOR : "none";  },
            };
        var MERGED_ELT_STYLE =  
            { stroke: "black",
              'stroke-width': 1, 
              fill: function (d, i) { 
                return targetVisible(i) ? NEUTRAL_COLOR : "none";  },
            };

        function mergesort(cont) {
            function showConnections() {
                var i;

                var conn = d3.select("#connections-ms");

                conn.selectAll("line").remove();
                function link(a, b) {
                    conn.append("svg:line")
                        .attr("x1", dataView.getX(a)*90.7)
                        .attr("y1", 0.25*90.7)
                        .attr("x2", mergedView.getX(b)*90.7)
                        .attr("y2", 60)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1);
                }

                for (i = 0; i < segments.length-1; i += 4) {
                    link(Math.floor(0.5 * (segments[i] + segments[i+2])),
                         Math.floor(0.5 * (segments[i] + segments[i+4])));
                    if (segments[i+2] != segments[i+4])
                        link(Math.floor(0.5 * (segments[i+2] + segments[i+4])),
                             Math.floor(0.5 * (segments[i] + segments[i+4])));
                }
            }

            function setPartitions(n) {
                var i;

                merged.length = 0;
                merged.length = A.length;
                d3.select("#mover").attr("transform", "translate(0,0)");
                dataView.getGaps().length = mergedView.getGaps().length = 0;
                segments.length = 0;
                for (i = 0; i < A.length; i += n) {
                    segments.push(i); segments.push(i); 
                    if (i % (2*n) == n)
                        dataView.getGaps()[i] = 2*GAP;
                    else if (i % (2*n) == 0 && i > 0) {
                        dataView.getGaps()[i] = 4*GAP;
                        mergedView.getGaps()[i] = 6*GAP;
                    }
                }
                if (segments.length % 4 == 0)
                    segments.push(A.length);
                else
                    segments.push(A.length, A.length, A.length);
                showConnections();
            }

            function initialPartition() {
                var i;
                setPartitions(2);
                step(compSwap);
            }

            function compSwap() {
                var i;
                for (i = 1; i < A.length; i += 2) {
                    opcount[0] += 1;
                    if (A[i] < A[i-1])
                        swap(A, i, i-1);
                }
                step(merge, 4, 0);
            }

            function merge(n, k) {
                var s;
                if (k == n) {
                    transferMerge(n);
                    return;
                }
                for (s = 0; s < segments.length-1; s += 4) {
                    if (segments[s+1] < segments[s+2] 
                        && segments[s+3] < segments[s+4])
                        opcount[0] += 1;

                    if (segments[s+1] < segments[s+2]
                        && (segments[s+3] >= segments[s+4] 
                            || A[segments[s+1]] <= A[segments[s+3]])) {
                        merged[k+segments[s]] = A[segments[s+1]];
                        A[segments[s+1]] = "";
                        segments[s+1] += 1;
                    } else if (segments[s+3] < segments[s+4]) {
                        merged[k+segments[s]] = A[segments[s+3]];
                        A[segments[s+3]] = "";
                        segments[s+3] += 1;
                    }
                }
                step(merge, n, k+1);
            }
                
            function transferMerge(n) {
                var i;
                for (i = 0; i < A.length; i += 1) {
                    A[i] = merged[i];
                    dataView.getGaps()[i] = mergedView.getGaps()[i];
                }
                syncView();
                d3.select("#mover").transition().duration(animationSpeed())
                    .attr("transform", sortingDemos.sortMovement)
                    .each("end", function () { repartition(n); });
            }

            function repartition(n) {
                setPartitions(n);
                if (n >= A.length) {
                    d3.select("#connections-ms").selectAll("line").remove();
                    merged.length = 0;
                    syncView();
                    step(cont);
                } else
                    step(merge, Math.min(2*n, A.length), 0);
            }

            function sort() {
                merged.length = 0;
                merged.length = A.length;
                segments.length = 0;
                segments[0] = segments[1] = 0;
                segments[2] = A.length;
                dataView.getGaps().length = 0;
                mergedView.getGaps().length = 0;
                syncView();

                step(initialPartition);
            }

            sort();
        }

        dataView = ad.arrayViewer("#disp", "data-ms",
                                  { array: A,
                                    eltHeight: 0.25, eltWidth: 0.25,
                                    eltStyle: MERGE_DATA_ELT_STYLE,
				  });
        registerView(dataView);
        mergedView = ad.arrayViewer("#disp", "merged-ms",
                                    { array: merged,
                                      eltHeight: 0.25, eltWidth: 0.25,
                                      eltStyle: MERGED_ELT_STYLE,
                                    });
        registerView(mergedView);	
                                      
        opView = ad.arrayViewer("#disp", "op-ms",
                                { array: opcount,
                                  eltHeight: 0.25, eltWidth: 0.4,
                                  eltStyle: VAR_ELT_STYLE });
        registerView(opView);	

	demo = { A: A, opcount: opcount, 
		 func: function () { mergesort(enableInteraction); },
	       };

	opcount[0] = '';
        clear(A);
        segments.length = 0;
        segments[0] = segments[1] = 0;
        segments[2] = A.length;
	syncView();
    }

    function radixSortDemo() {
        var A = [];
        var tmp = [];
        var counts = [];  counts.length = 10;
	var posns = []; posns.length = 10;
        var i, j;
	var opcount = [0];
        var charp = [''];
        var dataView, tmpView, charView, opView, countView, posnsView;
        var setDataPtrs, setCountPtrs;

        function explain(msg) {
            d3.select("#explain-rs").text(msg);
        }

        function transfer(cont) {
            var i;
            for (i = 0; i < A.length; i += 1) {
                if (tmp[i] != null)
                    A[i] = tmp[i];
                dataView.getGaps()[i] = tmpView.getGaps()[i];
            }
            syncView();
            d3.select("#mover").transition().duration(animationSpeed())
                .attr("transform", sortingDemos.sortMovement)
                .each("end", cont);
        }

        function LSDRadixSort(cont) {

            function sortPosition() {
                var k = charp[0];
                var i;

                function count(j) {
                    explain("Counting...");
                    setDataPtrs();
                    if (j >= A.length)
                        step(accumPosn, 1);
                    else {
                        setDataPtrs(j);
                        counts[A[j].substring(k,k+1)] += 1;
			opcount[0] += 1;
                        step(count, j+1);
                    }
                }                        

                function accumPosn(j) {
                    explain("Computing first positions for each digit...");
                    setCountPtrs();
                    if (j >= 10)
                        step(distribute, 0);
                    else {
                        posns[j] = posns[j-1] + counts[j-1];
                        setCountPtrs(j);
                        step(accumPosn, j+1);
                    }
                }

                function distribute(j) {
                    var c;
                    explain("Distributing keys to final positions...");
                    setDataPtrs();
                    if (j >= A.length) 
			transfer(function () { 
                            charp[0] -= 1;sortPosition(); });
                    else {
                        c = A[j].substring(k, k+1);
                        tmp[posns[c]] = A[j];
                        posns[c] += 1;
                        A[j] = null;
                        step(distribute, j+1);
                    }
                }


		d3.select("#mover").attr("transform", "translate(0, 0)");
		for (i = 0; i < tmp.length; i += 1)
		    tmp[i] = null;
                for (i = 0; i < 10; i += 1)
                    counts[i] = posns[i] = 0;
                if (k < 0) {
                    explain("");
                    charp[0] = '';
                    step(cont);
                } else
                    step(count, 0);
            }

            tmp.length = 0;
            tmp.length = A.length;
            dataView.getGaps().length = 0;
            tmpView.getGaps().length = 0;
            counts.length = 0;
            counts.length = 10;
            syncView();
            charp[0] = 2;
            sortPosition();
        }

        function MSDRadixSort(cont) {

            var i;
            var work = [];
            var L, U;

            function sortPartition() {
                function sortPosition() {
                    var k = charp[0];

                    function count(j) {
                        explain("Counting...");
                        setDataPtrs();
                        if (j > U) {
                            posns[0] = L;
                            step(accumPosn, 1);
                        } else {
                            setDataPtrs(j);
                            counts[A[j].substring(k,k+1)] += 1;
                            opcount[0] += 1;
                            step(count, j+1);
                        }
                    }                        

                    function accumPosn(j) {
                        explain("Computing first positions for each digit...");
                        setCountPtrs();
                        if (j >= 10)
                            step(repartition);
                        else {
                            posns[j] = posns[j-1] + counts[j-1];
                            setCountPtrs(j);
                            step(accumPosn, j+1);
                        }
                    }

                    function repartition() {
                        var j;
                        explain("Find new subsequences to sort...");
                        for (j = 0; j < 10; j += 1) {
                            if (counts[j] > 0) {
                                tmpView.getGaps()[posns[j]] = GAP;
                                if (counts[j] > 1)
                                    work.push(posns[j], 
                                              j == 9 ? U : posns[j+1]-1,
                                              k+1);
                            }
                        }
                        step(distribute, L);
                    }

                    function distribute(j) {
                        var c;
                        explain("Distributing keys to final positions...");
                        setDataPtrs();
                        if (j > U) 
                            transfer(sortPartition);
                        else {
                            c = A[j].substring(k, k+1);
                            tmp[posns[c]] = A[j];
                            posns[c] += 1;
                            A[j] = null;
                            step(distribute, j+1);
                        }
                    }
                    
		    d3.select("#mover").attr("transform", "translate(0, 0)");
                    

		    for (i = 0; i < tmp.length; i += 1)
		        tmp[i] = null;
                    for (i = 0; i < 10; i += 1)
                        counts[i] = posns[i] = 0;
                    if (k < 0) {
                        explain("");
                        step(cont);
                    } else
                        step(count, L);
                }

                if (work.length == 0) {
                    dataView.configure({ eltStyle: VAR_ELT_STYLE });
                    dataView.getGaps().length = 0;
                    tmpView.removeLabels();
                    tmp.length = 0;
                    charp[0] = '';
                    explain("");
                    step(cont);
                } else {
                    charp[0] = work.pop();
                    U = work.pop();
                    L = work.pop();
                    sortPosition();
                }

            }

            function chooseColor (d, i) {
                var j;
                if (L !== null && L <= i && i <= U)
                    return GT_COLOR;
                for (j = 0; j < work.length; j += 3) {
                    if (work[j] <= i && i <= work[j+1])
                        return UNSORTED_COLOR;
                }
                return NEUTRAL_COLOR;
            }

            tmp.length = 0;
            tmp.length = A.length;
            work.length = 0;
            dataView.getGaps().length = 0;
            tmpView.getGaps().length = 0;
            counts.length = 0;
            counts.length = 10;
            work.push(0, A.length-1, 0);
            L = U = null;
            dataView.configure({ 
                eltStyle: { stroke: "black", 
                            'stroke-width': 1, 
                            fill: chooseColor,
                          }
            });
            syncView();
            sortPartition();
        }

        dataView = ad.arrayViewer("#disp", "data-rs",
                                  { array: A,
                                    eltHeight: 0.25, eltWidth: 0.35,
                                    eltStyle: VAR_ELT_STYLE,
				    labelSep: 4,
				  });
        registerView(dataView);
        tmpView = ad.arrayViewer("#disp", "tmp-rs",
                                    { array: tmp,
                                      eltHeight: 0.25, eltWidth: 0.35,
                                      eltStyle: VAR_ELT_STYLE,
				      labelSep: 4,
                                    });
        registerView(tmpView);	
                                      
        opView = ad.arrayViewer("#disp", "op-rs",
                                { array: opcount,
                                  eltHeight: 0.25, eltWidth: 0.4,
                                  eltStyle: VAR_ELT_STYLE });
        registerView(opView);	

        countView = ad.arrayViewer("#disp", "count-rs",
                                   { array: counts,
                                     labelSep: 8,
                                     eltHeight: 0.25, eltWidth: 0.25,
                                     eltStyle: VAR_ELT_STYLE });
        registerView(countView);
	indexArray(countView);

        charView = ad.arrayViewer("#disp", "char-rs",
                                  { array: charp,
                                    eltHeight: 0.25, eltWidth: 0.25,
                                    eltStyle: VAR_ELT_STYLE });
        registerView(charView);

        posnsView = ad.arrayViewer("#disp", "posns-rs",
                                   { array: posns,
                                     labelSep: 8,
                                     eltHeight: 0.25, eltWidth: 0.25,
                                     eltStyle: VAR_ELT_STYLE });
        registerView(posnsView);
	indexArray(posnsView);

	demo = { A: A, opcount: opcount, 
		 func: function (type) { 
		     tmpView.removeLabels();
		     tmp.length = A.length;
		     indexArray(tmpView);
                     if (type == "Run1")
                         LSDRadixSort(enableInteraction); 
                     else
                         MSDRadixSort(enableInteraction); 
                 },
	       };

        setDataPtrs = getPointers(dataView);
        setCountPtrs = getPointers(countView);
	opcount[0] = '';
        clear(A);
	syncView();
    }

    sortingDemos = {
        commonSetup: commonSetup,
	setDataLength: setDataLength,
        insertionSortDemo: insertionSortDemo,
        shellsortDemo: shellsortDemo,
        selectionSortDemo: selectionSortDemo,
        quicksortDemo: quicksortDemo,
        heapsortDemo: heapsortDemo,
        mergesortDemo: mergesortDemo,
        radixSortDemo: radixSortDemo,
    };

})(jQuery);
