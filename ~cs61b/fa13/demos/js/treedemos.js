
(function ($) {

    var barrier = demos.barrier;
    var randomGenerator = demos.randomGenerator;
    var updateInt = demos.updateInt;
    var updateIntFromInput = demos.updateIntFromInput;
    var extend = demos.extend;
    var opPlayer = demos.opPlayer;
    var updateOptions = demos.updateOptions;
    var setKeyInput = demos.setKeyInput;
    var DISP = demos.DISP;
    var DB = demos.DB;
    var DBN = demos.DBN;

    var RD = Math.round;

    /* BINARY TREE STRUCTURE */

    /* Basic binary tree methods */
    
    function bintreeFactory() {
        var doUndo = opPlayer();
        var dummyNode;
        var uid;

        /** @public */
        function make(label, left, right, red) {
            var r = new BinTree(label, red);
            r.setLeft(left);
            r.setRight(right);
            r.uid = String(uid);
            uid += 1;
            return r;
        }

        function BinTree(label, red) {
            this.label = label;
            this.c0 = this.c1 = dummyNode;
            this.parent = null;
            this.red = red;
        }

        function getLabel() { return this.label; }
        function getLeft() { return this.c0; }
        function getRight() { return this.c1; }
        function getParent() { return this.parent; }

        function getSibling() { 
            var p = this.parent;
            if (p == null)
                return null;
            else if (p.c0 == this)
                return p.c1;
            else
                return p.c0;
        }

        function isEmpty() { return false; }
        function isLeftChild() { return this.parent && 
                                   this == this.parent.c0; }
        function isRightChild() { return this.parent && 
                                    this == this.parent.c1; }

        function setLabel(newVal) {
            doUndo.recordUndo(setLabel, setLabel, this, [newVal], [this.label]);
            this.label = newVal;
            return this;
        }
        function setLeft(child) { 
            child = child || new EmptyBinTree();
            doUndo.recordUndo(setLeft, setLeft, this, [child], [this.c0]);
            if (this.c0.parent === this)
                this.c0.parent = null;
            this.c0 = child;
            child.parent = this;
            return this;
        }
        function setRight(child) {
            child = child || new EmptyBinTree();
            doUndo.recordUndo(setRight, setRight, this, [child], [this.c1]);
            if (this.c1.parent === this)
                this.c1.parent = null;
            this.c1 = child;
            child.parent = this;
            return this;
        }

        function left(maybeChild) {
            if (maybeChild === undefined) 
                return this.c0;
            else
                return this.setLeft(maybeChild);
        }

        function right(maybeChild) {
            if (maybeChild === undefined) 
                return this.c1;
            else
                return this.setRight(maybeChild);
        }

        function leftAccessor() {
            return this.left;
        }

        function rightAccessor() {
            return this.right;
        }

        function accessor(child) {
            if (child === undefined) {
                if (this.isLeftChild())
                    return this.left;
                else if (this.isRightChild())
                    return this.right;
                else
                    return null;
            } else if (child === this.c0)
                return this.left;
            else if (child == this.c1) 
                return this.right;
            else
                return null;
        }

        function siblingsAccessor(child) {
            if (child === undefined) {
                if (this.isLeftChild())
                    return this.right;
                else if (this.isRightChild())
                    return this.left;
                else
                    return null;
            } else if (child === this.c0)
                return this.right;
            else if (child == this.c1) 
                return this.left;
            else
                return null;
        }

        function replace(newVal, child) {
            if (child === undefined)
                this.accessor().call(this.getParent(), newVal);
            else
                this.accessor(child).call(this, newVal);
            return newVal;
        }
        
        function isRed() { 
            return this.red; 
        }

        function isBlack() { 
            return !this.red; 
        }

        function redden() {
            return this.setColor(true);
        }
        function blacken() { 
            return this.setColor(false);
        }

        function setColor(color) {
            doUndo.recordUndo(setColor, setColor, this, [color], [this.red]);
            this.red = color;
            return this;
        }

        function rotate() {
            var p = this.parent
            if (p == null)
                return this;
            if (this === p.c0) {
                var l = p.c0;
                var lr = l.c1;
                p.setLeft(lr);
                l.setRight(p);
            } else {
                var r = p.c1;
                var rl = r.c0;
                p.setRight(rl);
                r.setLeft(p);
            }
            return this;
        }

        function each(f) {
            f(this.c0, 0);
            f(this.c1, 1);
        }

        function height() {
            var h0 = this.c0.height(), h1 = this.c1.height();

            if (h0 > h1) 
                return h0 + 1;
            else
                return h1 + 1;
        }

        function depth() {
            var d;
            d = 0;
            for (var p = this; p.parent != null; p = p.parent) 
                d += 1;
            return d;
        }

        extend(BinTree.prototype,
               { getLabel: getLabel,
                 getLeft: getLeft,
                 getRight: getRight,
                 getParent: getParent,
                 getSibling: getSibling,
                 isEmpty: isEmpty,
                 isLeftChild: isLeftChild,
                 isRightChild: isRightChild,
                 setLabel: setLabel,
                 setLeft: setLeft,
                 setRight: setRight,
                 left: left,
                 right: right,
                 leftAccessor: leftAccessor,
                 rightAccessor: rightAccessor,
                 accessor: accessor,
                 siblingsAccessor: siblingsAccessor,
                 replace: replace,
                 isRed: isRed,
                 isBlack: isBlack,
                 redden: redden,
                 blacken: blacken,
                 setColor: setColor,
                 rotate: rotate,
                 each: each,
                 height: height,
                 depth: depth,
               });

        function bad(name) {
            return function () {
                throw new Error("'" + name + "' is invalid on null tree");
            }
        }

        uid = 1;

        function EmptyBinTree() {
            this.label = null;
            this.c0 = this.c1 = null;
            this.parent = null;
            this.uid = uid;
            uid += 1;
        }

        EmptyBinTree.prototype = new BinTree(null, null, null, false);

        extend(EmptyBinTree.prototype, {
            isEmpty: function () { return true; },
            isRed: function () { return false; },
            isBlack: function () { return true; },
            
            setLabel: bad("setLabel"),
            setLeft: bad("setLeft"),
            setRight: bad("setRight"),
            left: bad("left"),
            right: bad("right"),
            leftAccessor: bad("leftAccessor"),
            rightAccessor: bad("rightAccessor"),
            replace: replace,
            redden: bad("redden"),
            blacken: function () { return false; },
            rotate: bad("rotate"),
            each: function () { return this; },
            height: function () { return -1; },
        });

        dummyNode = new EmptyBinTree();

        return { 
            make: make,
            setRecordingMode: doUndo.setRecordingMode,
            undo: doUndo.undo,
            markUndo: doUndo.markUndo,
            undoToMark: doUndo.undoToMark,
	    undoAll: doUndo.undoAll,
            redo: doUndo.redo,
            redoToMark: doUndo.redoToMark,
            redoAll: doUndo.redoAll,
            trimUndo: doUndo.trimUndo
        };

    }
    
    function gentreeFactory() {
        var doUndo = opPlayer();
        var uid;

        /** @public */
        function make(label, kids) {
	    var n, i;
	    var source, children;
	    if (kids !== undefined && kids.length !== undefined) {
		n = kids.length;
		source = kids;
	    } else {
		n = make.arguments.length - 1;
		source = make.arguments;
	    }
	    children = [];
	    for (i = source.length - n; i < source.length; i += 1) 
		children.push(source[i]);

            var r = new GenTree(label, children);
            r.uid = String(uid);
            uid += 1;
            return r;
        }

        function GenTree(label, children) {
            this.label = label;
            this.children = children;
        }

        function getLabel() { return this.label; }
	function arity() { return this.children.length; }
        function get(k) { return this.children[k]; }

        function setLabel(newVal) {
            doUndo.recordUndo(setLabel, setLabel, this, [newVal], [this.label]);
            this.label = newVal;
            return this;
        }
	function set(k, newVal) {
	    doUndo.recordUndo(set, set, this, 
                              [k, newVal], [k, this.children[k]]);
            this.children[k] = newVal;
            return this;
	}

        function add(newVal, k) {
            doUndo.recordUndo(add, remove, this, [newVal, k], [k]);
            if (k == null)
                this.children.push(newVal);
            else
                this.children.splice(k, 0, newVal);
            return this;
        }

        function remove(k) {
            if (k == null)
                k = this.children.length-1;
            doUndo.recordUndo(remove, add, this, [k], [k, this.children[k]]);
            this.children.splice(k, 1);
            return this;
        }

        function each(f) {
	    var i;
	    for (i = 0; i < this.children.length; i += 1)
		f(this.children[i], i);
	}

        function height(tree) {
	    var h;
            tree = tree === undefined ? this : tree;
            if (tree == null) 
                return -1;
	    tree.setDepths();
	    h = -1;
	    function maxDepth(t) {
		var i;
		h = Math.max(t.depth, h);
		for (i = 0; i < t.children.length; i += 1) 
		    maxDepth(t.children[i]);
	    }
	    maxDepth(tree);
	    return h;
        }

	function setDepths(tree) {
	    function depth(t, d) {
		var i;
		t.depth = d;
		for (i = 0; i < t.children.length; i += 1)
                    depth(t.children[i], d+1);
	    }
	    tree = tree === undefined ? this : tree;
	    if (tree !== null)
		depth(tree, 0);
	}

        extend(GenTree.prototype,
               { getLabel: getLabel,
                 setLabel: setLabel,
                 arity: arity,
		 get: get,
		 set: set,
                 add: add,
                 remove: remove,
                 each: each,
                 height: height,
		 setDepths: setDepths,
               });


        undoIndex = -1;
        recording = true;
        uid = 1;

        return { 
            make: make,
            setRecordingMode: doUndo.setRecordingMode,
            undo: doUndo.undo,
            markUndo: doUndo.markUndo,
            undoToMark: doUndo.undoToMark,
	    undoAll: doUndo.undoAll,
            redo: doUndo.redo,
            redoToMark: doUndo.redoToMark,
            redoAll: doUndo.redoAll,
            trimUndo: doUndo.trimUndo
        };

    }

    /* VIEWERS */

    /* Definition of "basic unit":  The basic unit of measure for viewer V is
     * defined to be V.unit pixels.  */

    // FIXME: need to display action being (un)done.


    /** @private */
    function separation(a, b, getNodeWidth, horizSep) {
        var sep = horizSep + 0.5 * (getNodeWidth(a) + getNodeWidth(b));
        return sep;
    }

    /** @private */
    function separator(getNodeWidth, horizSep) {
        return function (a, b) { 
            return separation(a, b, getNodeWidth, horizSep); 
        };
    }

    /** @private */
    function proxyScaling(proxyRoot, getNodeWidth, separation) {
	var scaling, minX, maxX;

	function traverse(node) {
	    var i;
	    if (node.children == null || node.children.length == 0)
		return;
	    traverse(node.children[0]);
	    for (i = 1; i < node.children.length; i += 1) {
                var sep = separation(node.children[i], node.children[i-1]);
		var dx = node.children[i].x - node.children[i-1].x;
		scaling = Math.max(scaling, sep / dx);
		traverse(node.children[i]);
	    }
	}
        function minMax(node) {
            var j;
            var w = 0.5 * getNodeWidth(node);
            minX = Math.min(minX, node.x*scaling - w);
            maxX = Math.max(maxX, node.x*scaling + w);
            for (j = 0; j < (node.children ? node.children.length : 0); j += 1) {
                minMax(node.children[j]);
            }
        }        

	scaling = 0;
        traverse(proxyRoot);
        minX = Infinity; maxX = -Infinity;
        minMax(proxyRoot);
	return { scaling: scaling, xlow: minX, xhigh: maxX };
    }

    /** @private */
    function applyStyle(sel, styleParams) {
	function styler(styleParam) {
	    if (typeof styleParam == 'function') {
		return function (d, i) {
		    if (d.tree != null) {
			return styleParam(d.tree);
		    } else if (d.source != null && d.target != null) {
			return styleParam(d.source.tree, d.target.tree);
		    } else
			return styleParam(d, i);
		}
	    } else 
		return styleParam;
	}

        for (key in styleParams) {
	    if (styleParams.hasOwnProperty(key)) {
                sel.attr(key, styler(styleParams[key]));
	    }
	}
    }

    /******* Binary trees *********/

    /** @private */
    BintreeViewerDefaults = {
        unit: 90.7,  /* pixel */

        /** Node styling.  An object whose keys are style attribute names and
         *  whose values are either values convertible to strings or functions
         *  (function (node) { ... }) that return the style value. */
        nodeStyle: { stroke: "black", "stroke-width": 1, opacity: 1, 
                     fill: "rgba(0, 0, 0, 0)" },

        /** Label representation: applied to node to get the text 
         *  labeling it. */
        labelText: function (node) { 
            return node.getLabel() === null ? "" : String(node.getLabel()); 
        },

	/** A function yielding a UID associated with each label 
	 *  to allow tracking of the movement of labels through a tree. */
	labelUid: function (label) { return label ? label.uid : ""; },

        /** Style parameters for edges, as for nodeStyle. */
        edgeStyle: { "stroke-width": 2, "stroke": "black" },

        /** Extra padding in pixels for position of top node. */
        topPad: 2,

        animateTime: 1000,  /* Milliseconds */

        /** Width of area displaying tree (in pixels).  If a number, the root
         * is centered in the given width.  "auto" means to use the actual 
	 * tree's width, left-justifying the view in the parent element. */
        width: "auto",

        /** Height of area displaying tree.  "auto" means to compute the 
	 *  necessary value from the height of the tree. */
	height: "auto",

        /** Height of line of text in pixels. */
        textHeight: 12,

        /* The following distance and size parameters are in basic units. **/
        nodeRadius: 0.2,
        /** Separation between levels. */
        vertSep: 0.8, 
        /** Minimum separation between nodes on the same level. */
        horizSep: 0.4, 

        /** Event handler for mouse clicks on nodes.  A function taking two 
         *  arguments: the tree node clicked on and the event object generated by
         *  the click. */
        nodeClickHandler: null,

        /** Event handler for mouse double-clicks on nodes.  A function taking two 
         *  arguments: the tree node clicked on and the event object generated by
         *  the click. */
        nodeDblClickHandler: null,

    };

    /** @constructor */
    function bintreeViewer(parent, tag, options) {
	/** @private */
	function makeLayoutProxy(tree) {
	    var nodes = { };

	    function copy(tree) {
		var nodeUid = tree.uid;
		var labelUid = params.labelUid(tree.getLabel());

		if (nodes[tree.uid])
		    throw new Error("circular tree detected");
		nodes[tree.uid] = true;

		if (tree.isEmpty() || 
		    (tree.getLeft().isEmpty() && tree.getRight().isEmpty()))
		    return { tree: tree, children: null, nodeUid: nodeUid,
			     labelUid: labelUid};
		else
		    return { tree: tree,
			     children: [ copy(tree.getLeft()), 
					 copy(tree.getRight()) ],
			     nodeUid: nodeUid, labelUid: labelUid
			   };
	    }

	    return copy(tree);
	}

        function handleClick(d, i) {
            if (d.tree && params.nodeClickHandler)
                return params.nodeClickHandler(d.tree, d3.event);
        }

        function handleDblClick(d, i) {
            if (d.tree && params.nodeDblClickHandler)
                return params.nodeDblClickHandler(d.tree, d3.event);
        }

        function treeKey(proxyNode) {
            return proxyNode.nodeUid;
        }

        function labelKey(proxyNode) {
            return proxyNode.labelUid;
        }

        function edgeKey(edgeProxy) {
            var n0 = edgeProxy.source.tree, n1 = edgeProxy.target.tree;
            if (n1.isLeftChild())
                return n0.uid + "L";
            else
                return n0.uid + "R";
        }

        /** @private */
        function nodeWidth(a) {
            return a.tree.isEmpty() ? 0 : 2 * params.nodeRadius * params.unit;
        }

        /** @private */
        function separation(a, b) {
            return params.horizSep * params.unit 
                + 0.5 * (nodeWidth(a) + nodeWidth(b));
        }

        /** @private */
        function layoutTree(tree) {
            var i;
            var proxy = makeLayoutProxy(tree);

            var layout = d3.layout.tree();
            layout.separation(separation);
            var nodes = layout.nodes(proxy);
            var links = layout.links(nodes);
            var radius = params.unit * params.nodeRadius;
            var dims = 
                proxyScaling(proxy, nodeWidth, separation);

            var sy, xshift;

            if (params.width == "auto") {
                width = Math.max(dims.xhigh - dims.xlow, 0);
                xshift = -dims.xlow;
            } else {
                width = params.width;
                xshift = width*0.5 - proxy.x*dims.scaling;
            }

            if (params.height == "auto")
                height = 
		Math.max(height,
			 (tree.height() + 1) * params.unit * params.vertSep 
			 + params.topPad + radius);
            else
                height = Math.max(height, params.height);

            sy = params.unit * params.vertSep;

            for (i = 0; i < nodes.length; i += 1) {
                nodes[i].x = xshift + nodes[i].x * dims.scaling;
                nodes[i].y = params.topPad + radius + nodes[i].depth * sy;
            }

            var source, target, dx, ddy, len;
            for (i = 0; i < links.length; i += 1) {
                source = links[i].source;
                target = links[i].target;
                dx = target.x - source.x;
                dy = target.y - source.y;
                len = Math.sqrt(dx*dx + dy*dy);

                if (dx == 0) 
                    links[i].x1 = links[i].x2 = source.x;
                else {
                    links[i].x1 = source.x + dx * radius / len;
                    links[i].x2 = source.x + dx * (len - radius) / len;
                }
                if (dy == 0) 
                    links[i].y1 = links[i].y2 = source.y;
                else {
                    links[i].y1 = source.y + dy * radius / len;
                    links[i].y2 = source.y + dy * (len - radius) / len;
                }
            }

            return { nodes: nodes, links: links};
        }

	/** @private */
	function nonNull(proxyNode) {
	    return proxyNode && proxyNode.tree && ! proxyNode.tree.isEmpty();
	}

	/** @private */
	function nonEmptyLabel(proxyNode) {
	    return proxyNode && proxyNode.tree && 
                proxyNode.tree.getLabel() !== null;
	}

        function nonEmptyEdge(edgeProxy) {
            return edgeProxy.target.tree && !edgeProxy.target.tree.isEmpty();
        }

        function emptyEdge(edgeProxy) {
            return !edgeProxy.target.tree || edgeProxy.target.tree.isEmpty();
        }

        /** @private */
        function drawNodes(proxyNodes) {
            var sel;
            sel = 
		proxyNodes.filter(nonNull).append("svg:circle")
                .attr("class", "tree-node")
                .call(applyStyle, params.nodeStyle)
                .attr("r", params.nodeRadius*params.unit)
                .attr("cx", function (d) { return RD(d.x); })
                .attr("cy", function (d) { return RD(d.y); })
                .on('click', handleClick)
                .on('dblclick', handleDblClick);
        }

        /** @private */
        function labelTranslate(d) {
            return "translate(" + RD(d.x) + "," + 
                RD(d.y + 0.5*params.textHeight) + ")";
        }

        function setText(d) {
            var i;

            var S = d3.select(this);
            S.selectAll("text").remove();

            if (d.tree.getLabel() === null)
                return;
            var L = params.labelText(d.tree)
                .replace(/^\s+|\s+$/g, "").split(/\s/);
            
            var y0 = -0.5 * (L.length-1) * params.textHeight;
            for (i = 0; i < L.length; i += 1) {
                S.append("svg:text")
                    .attr("class", "node-label")
                    .attr("y", y0 + i * params.textHeight)
                    .text(L[i])
                    .on('click', handleClick)
                    .on('dblclick', handleDblClick);
            }
        }

	/** @private */
	function drawLabels(proxyNodes) {
	    proxyNodes.filter(nonEmptyLabel).append("svg:g")
                .attr("transform", labelTranslate)
                .each(setText);
	}

        function drawEdges(edges) {
            edges.filter(nonEmptyEdge).append("svg:line")
                .attr("class", "tree-edge")
                .call(applyStyle, params.edgeStyle)
                .attr("x1", function (d) { return RD(d.x1); })
                .attr("y1", function (d) { return RD(d.y1); })
                .attr("x2", function (d) { return RD(d.x2); })
                .attr("y2", function (d) { return RD(d.y2); })
        }

        /** @private */
        function eraseNodes(exitNodes, sema) {
            exitNodes.transition().duration(params.animateTime)
	        .each('start', sema.start).each('end', sema.finish)
		.attr('cy', height + 2*params.nodeRadius)
                .remove();
        }

        function eraseLabels(exitNodes, sema) {
            exitNodes.transition().duration(params.animateTime)
	        .each("start", sema.start).each("end", sema.finish)
                .attr("transform", 
                      function (d, i) {
                          return "translate(" + d.x + "," 
                              + (height + 2*params.nodeRadius*params.unit) + ")";
                      })
                .remove();
        }

	function eraseEdges(exitNodes) {
	    exitNodes.remove();
	}

        function setOptions(options) {
	    updateOptions(params, options, BintreeViewerDefaults, false);
        }

	function currentNodeUpdates(nodes) {
	    return d3.select(nodesGroupSel).selectAll("circle")
                .data(nodes, treeKey);
        }

        function currentLabelUpdates(nodes) {
            return d3.select(labelsGroupSel).selectAll("g")
                .data(nodes, labelKey);
        }

        function currentEdgeUpdates(edges) {
            return d3.select(edgesGroupSel).selectAll("line")
                .data(edges, edgeKey);
        }

        function draw(tree, cont) {
	    width = height = 0;
            var layout = layoutTree(tree);
            var nodes = layout.nodes, edges = layout.links;

	    if (svgSel !== null) 
		d3.select(svgSel).attr("width", width).attr("height", height);

            currentNodeUpdates(nodes).remove().exit().remove();
	    currentLabelUpdates(nodes).remove().exit().remove();
	    currentEdgeUpdates(edges).remove().exit().remove();
            drawNodes(currentNodeUpdates(nodes).enter());
	    drawLabels(currentLabelUpdates(nodes).enter());
            drawEdges(currentEdgeUpdates(edges).enter());
	    if (cont)
		cont();
        };

	function updateNodes(updates, sema) {
	    updates.call(applyStyle, params.nodeStyle)
	        .transition()
	        .duration(params.animateTime)
		.each('start', sema.start).each('end', sema.finish)
                .attr('cx', function (d) { return RD(d.x); })
	        .attr('cy', function (d) { return RD(d.y); });
	}

	function updateLabels(updates, sema) {
	    updates.transition()
	        .duration(params.animateTime)
		.each('start', sema.start).each('end', sema.finish)
                .attr("transform", labelTranslate);
	}

	function updateEdges(edgeUpdates, sema) {
	    edgeUpdates.filter(nonEmptyEdge).transition()
	        .duration(params.animateTime)
		.each('start', sema.start).each('end', sema.finish)
                .attr("x1", function (d) { return RD(d.x1); })
                .attr("y1", function (d) { return RD(d.y1); })
                .attr("x2", function (d) { return RD(d.x2); })
                .attr("y2", function (d) { return RD(d.y2); });
	    edgeUpdates.filter(emptyEdge).remove();
	}

	function update(tree, cont) {
            var layout = layoutTree(tree);
            var nodes = layout.nodes, edges = layout.links;

	    if (svgSel !== null) 
		d3.select(svgSel).attr("width", width).attr("height", height);

	    var nodeUpdates = currentNodeUpdates(nodes);
	    var labelUpdates = currentLabelUpdates(nodes);
	    var edgeUpdates = currentEdgeUpdates(edges);

	    var sema = barrier();
	    sema.start();
	    updateNodes(nodeUpdates, sema);
	    updateLabels(labelUpdates, sema);
	    updateEdges(edgeUpdates, sema);
	    eraseNodes(nodeUpdates.exit(), sema);
	    eraseLabels(labelUpdates.exit(), sema);
	    eraseEdges(edgeUpdates.exit());
	    sema.setContinuation(function () {
		drawNodes(nodeUpdates.enter());
		drawLabels(labelUpdates.enter());
		drawEdges(edgeUpdates.enter());
		cont();
	    });
	    sema.finishAfterDelay(params.animateTime);
	}

        var params = {};
        updateOptions(params, options, BintreeViewerDefaults, true);

        tag = tag || parent + "-tree";

        var width, height;
	width = height = 0;

	var svgTag, svgSel;
	var sel = "#" + tag;
	var nodesTag = tag + "-nodes";
	var labelsTag = tag + "-labels";
	var edgesTag = tag + "-edges";
	var nodesGroupSel = "#" + nodesTag;
	var labelsGroupSel = "#" + labelsTag;
	var edgesGroupSel = "#" + edgesTag;

        var P = d3.select("#" + parent);
        if (P.length == 0) 
            throw new Error("No element with id=" + parent);

	if (P.property("tagName") == "SVG") {
	    P.selectAll(sel).data([0]).enter().append("svg:g").attr("id", tag);
	    svgTag = svgSel = null;
	} else {
	    svgTag = tag + "-svg";
	    svgSel = "#" + svgTag;
	    P.append("svg").attr("version", "1.1")
		.attr("id", svgTag)
                .append("svg:g").attr("id", tag);
	}

	d3.select(nodesGroupSel).remove();
	d3.select(labelsGroupSel).remove();
	d3.select(edgesGroupSel).remove();
	var S = d3.select(sel);
	S.append("g").attr("id", nodesTag);
	S.append("g").attr("id", labelsTag);
	S.append("g").attr("id", edgesTag);

        return { 
            draw: draw,
	    update: update,
            setOptions: setOptions,
        };
    }            

    /******* 2-4 trees *********/

    /** @private */
    Bintree2_4ViewerDefaults = {
        unit: 90.7,  /* pixel */

        /** Node styling.  An object whose keys are style attribute names and
         *  whose values are either values convertible to strings or functions
         *  (function (node) { ... }) that return the style value. */
        nodeStyle: { stroke: "black", "stroke-width": 1, opacity: 1, 
		     fill: "rgba(0, 0, 0, 0)" },

        /** Label representation: applied to label to get the text 
         *  representing it. */
        labelText: function (node) { 
            return node.getLabel() === null ? "" : String(node.getLabel()); 
        },

        edgeStyle: { "stroke-width": 2, stroke: "black" },

        /** Extra padding in pixels for position of top node. */
        topPad: 2,

        /** Width of area displaying tree.  The root is centered in the given
         *  width.  "auto" means to use the actual tree's width, left-justifying
         *  the view in the parent element. */
        width: "auto",

	height: "auto",

        /** Height of line of text in pixels. */
        textHeight: 10,

        /* The following distance and size parameters are in basic units. **/
        nodeRadius: 0.2,
        /** Separation between levels. */
        vertSep: 0.8, 
        /** Minimum separation between nodes on the same level. */
        horizSep: 0.4, 

        /** Event handler for mouse clicks on nodes.  A function taking two 
         *  arguments: the tree node clicked on and the event object generated by
         *  the click. */
        nodeClickHandler: null,

        /** Event handler for mouse double-clicks on nodes.  A function taking two 
         *  arguments: the tree node clicked on and the event object generated by
         *  the click. */
        nodeDblClickHandler: null,

    };

    function bintree2_4Viewer(parent, tag, options) {
	/** @public */
        function setOptions(options) {
	    updateOptions(params, options, BinTree2_4ViewerDefaults, false);
        }

	/** @public */
        function draw(tree, cont) {
            width = height = 0;
            var layout = layoutTree(tree);

	    if (svgSel !== null) 
		d3.select(svgSel).attr("width", width).attr("height", height);

            currentNodes().remove();
            currentEdges().remove();
            currentLabels().remove();

            drawNodes(currentNodes().data(layout.nodes).enter());
            drawEdges(currentEdges().data(layout.links).enter());
            drawKeys(currentLabels().data(layout.links).enter());

	    if (cont)
	        cont();
        }

        /** @private */
	function currentNodes() {
	    return d3.select(nodesGroupSel).selectAll("rect");
        }

        /** @private */
        function currentLabels() {
            return d3.select(labelsGroupSel).selectAll("text");
        }

        /** @private */
        function currentEdges() {
            return d3.select(edgesGroupSel).selectAll("line");
        }

	/** @private */
        function eachChild(node, func) {
	    var k;
	    k = 0;

	    function findKids(node) {
	        if (node.isBlack())
		    func(node, k++);
	        else {
		    findKids(node.getLeft());
		    findKids(node.getRight());
	        }
	    }

	    if (!node.isEmpty()) {
		findKids(node.getLeft());
		findKids(node.getRight());
	    }
        }

	/** @private */
        function eachLabel(node, func) {
	    var k;
	    k = 0;
	    
	    function findLabels(node) {
	        if (node.getLeft().isRed())
		    findLabels(node.getLeft());
	        if (func != null)
		    func(node, k);
	        k += 1;
	        if (node.getRight().isRed())
		    findLabels(node.getRight());
	    }		

	    findLabels(node);
	    return k;
        }

	/** @private */
        function nodeWidth(proxyNode) {
	    return Math.max(2 * proxyNode.labels.length * params.nodeRadius * params.unit,
                            params.nodeRadius * params.unit);
        }

	/** @private */
	function makeLayoutProxy(root) {

	    function copy(node, k) {
		if (node.isEmpty())
		    return { labels: [], position: k, children: null };
                else if (node.getLabel() === null) {
                    if (node.getLeft().isEmpty()) 
                        return { labels: [], position: k, 
                                 children: [ copy(node.getRight(), 0) ] };
                    else
                        return { labels: [], position: k, 
                                 children: [ copy(node.getLeft(), 0) ] };
                }
		var proxy = { labels: [], position: k, children: [] };
		eachChild(node, function (kid, i) { 
		    proxy.children.push(copy(kid, i));
		});
		eachLabel(node, function (node) {
		    proxy.labels.push(node);
		});
                return proxy;
	    }

	    return copy(root);
	}
	    
        /** @private */
        function separation(a, b) {
            var sep;
            if ((a.labels === null || a.labels.length == 0) && 
                (b.labels === null || b.labels.length == 0))
                sep = 0.001 * params.nodeRadius * params.unit;
            else
                sep = params.horizSep * params.unit 
                + 0.5 * (nodeWidth(a) + nodeWidth(b));

            return sep;
        }

	function layoutTree(root) {
	    var i;
	    var proxy = makeLayoutProxy(root);

            if (root == null)
                return { nodes: [], links: [] };

	    // FIXME: Refactor
	    var layout = d3.layout.tree();
            layout.size([1, 0.5]);
            layout.separation(separation);
	    var nodes = layout.nodes(proxy);
	    var links = layout.links(nodes);
            var radius = params.unit * params.nodeRadius;
            var dims = 
                proxyScaling(proxy, nodeWidth, separation);

            var sy, xshift;

	    if (params.width == "auto") {
                width = Math.max(dims.xhigh - dims.xlow, 0);
                xshift = -dims.xlow;
            } else {
                width = params.width;
                xshift = width*0.5 - proxy.x*dims.scaling;
            }

            if (params.height == "auto")
                height = 
		Math.max(height,
			 (root.height() + 1) * params.unit * params.vertSep 
			 + params.topPad + radius);
            else
                height = Math.max(height, params.height);

            sy = params.unit * params.vertSep;

            for (i = 0; i < nodes.length; i += 1) {
                nodes[i].x = xshift + nodes[i].x * dims.scaling;
                nodes[i].y = params.topPad + radius + nodes[i].depth * sy;
            }

            var source, target, w, p, sep;
            for (i = 0; i < links.length; i += 1) {
                source = links[i].source;
                target = links[i].target;
                p = target.position;
                w = 0.5 * nodeWidth(source);
                sep = (2*source.labels.length-1)*radius / source.labels.length;
                links[i].x1 = source.x - w + 0.5 * radius + p * sep;
                links[i].x2 = target.x;
                links[i].y1 = source.y + radius;
                links[i].y2 = target.y - radius;
                if (links[i].target.children === null) {
                    links[i].target.y = links[i].y2 
                        -= 0.5 * params.vertSep * params.unit;
                    links[i].target.x = links[i].x2 = links[i].x1;
                }
            }

            return { nodes: nodes, links: links };

	}
	    
        /** @private */
        function drawNodes(proxyNodes) {
            var radius = params.nodeRadius * params.unit;
            proxyNodes.filter(function (d) { return d.children !== null; })
                .append("svg:rect")
                .call(applyStyle, params.nodeStyle)
                .attr("width", nodeWidth)
                .attr("height", 2 * radius)
                .attr("x", function (d) { return RD(d.x - 0.5 * nodeWidth(d)); })
                .attr("y", function (d) { return RD(d.y - radius); })
                .attr("rx", 0.5 * radius)
                .attr("ry", radius)
            proxyNodes.filter(function (d) { return d.children === null; })
                .append("svg:rect")
                .attr("width", 0.5 * radius)
                .attr("height", 0.5 * radius)
                .attr("x", function (d) { return RD(d.x - 0.25 * radius); })
                .attr("y", function (d) { return RD(d.y); })
                .attr("fill", "black")
        }

        function drawKeys(edges) {
            var radius = params.nodeRadius * params.unit;
            edges.filter(function (d) { 
                return d.target.position < d.source.labels.length; })
                .append("svg:text")
	        .attr("class", "node-label")
                .attr("x", function (d) { 
                    var sep = (2*d.source.labels.length-1)*radius 
                        / d.source.labels.length;

                    return RD(d.x1 + 0.5 * sep);
                })
                .attr("y", function (d) {
                    return d.source.y + 0.5 * params.textHeight;
                })
	        .text(function (d) { 
		    return params.labelText(d.source.labels[d.target.position]);
		});
        }

        /** @private */
        function drawEdges(edges) {
            edges.append("svg:line")
                .attr("class", "tree-edge")
                .call(applyStyle, params.edgeStyle)
                .attr("x1", function (d) { return RD(d.x1); })
                .attr("y1", function (d) { return RD(d.y1); })
                .attr("x2", function (d) { return RD(d.x2); })
                .attr("y2", function (d) { return RD(d.y2); })
        }

	var params = {};
        updateOptions(params, options, Bintree2_4ViewerDefaults, true);

        tag = tag || parent + "-tree";

        var width, height;

	width = height = 0;

	var svgTag, svgSel;
	var sel = "#" + tag;
	var nodesTag = tag + "-nodes";
	var labelsTag = tag + "-labels";
	var edgesTag = tag + "-edges";
	var nodesGroupSel = "#" + nodesTag;
	var labelsGroupSel = "#" + labelsTag;
	var edgesGroupSel = "#" + edgesTag;

        var P = d3.select("#" + parent);
        if (P.length == 0) 
            throw new Error("No element with id=" + parent);

	if (P.property("tagName") == "SVG") {
	    P.selectAll(sel).data([0]).enter().append("svg:g").attr("id", tag);
	    svgTag = svgSel = null;
	} else {
	    svgTag = tag + "-svg";
	    svgSel = "#" + svgTag;
	    P.append("svg").attr("version", "1.1")
		.attr("id", svgTag)
                .append("svg:g").attr("id", tag);
	}

	d3.select(nodesGroupSel).remove();
	d3.select(labelsGroupSel).remove();
	d3.select(edgesGroupSel).remove();
	var S = d3.select(sel);
	S.append("g").attr("id", nodesTag);
	S.append("g").attr("id", labelsTag);
	S.append("g").attr("id", edgesTag);

        return { draw: draw, setOptions: setOptions };

    };

    /******* General trees *********/

    /** @private */
    GentreeViewerDefaults = {
        unit: 90.7,  /* pixel */

        /** Node styling.  An object whose keys are style attribute names and
         *  whose values are either values convertible to strings or functions
         *  (function (node) { ... }) that return the style value. */
        nodeStyle: { stroke: "black", "stroke-width": 1, opacity: 1, 
		     rx: 0.2*90.7, ry: 0.2*90.7,
		     fill: "rgba(0, 0, 0, 0)" },

        /** Label representation: applied to label to get the text 
         *  representing it. */
        labelText: function (node) { 
            return node.getLabel() === null ? "" : String(node.getLabel()); 
        },

        /** Function that returns the width of a node (in units). */
        nodeWidth: function (node, params) { return params.nodeHeight; },

        edgeStyle: { "stroke-width": 2, stroke: "black" },

        /** Extra padding on top of viewing area (pixels). */
        topPad: 2,

        /** Extra padding on bottom of viewing area (pixels). */
        bottomPad: 2,

        /** Extra padding on left of viewing area (pixels). */
        leftPad: 2,

        /** Extra padding on right of viewing area (pixels). */
        rightPad: 2,

        /** Width of area displaying tree.  The root is centered in the given
         *  width.  "auto" means to use the actual tree's width, left-justifying
         *  the view in the parent element. */
        width: "auto",

        /** Height of area displaying tree.  "auto" means to use the actual 
         *  tree's height.  */
	height: "auto",

        /** Height of line of text in pixels. */
        textHeight: 10,

        /* The following distance and size parameters are in basic units. **/
        /** Height of a node. */
        nodeHeight: 0.4,
        /** Separation between levels. */
        vertSep: 0.8, 
        /** Minimum separation between nodes on the same level. */
        horizSep: 0.4, 
	/** Corner curvature in the x direction (also y if yr is defaulted). */
	rx: 0.2,
	/** Corner curvature in the y direction (defaults to rx). */
	ry: null,

        animateTime: 1000,  /* Milliseconds */

        /** Event handler for mouse clicks on nodes.  A function taking two 
         *  arguments: the tree node clicked on and the event object generated by
         *  the click. */
        nodeClickHandler: null,

        /** Event handler for mouse double-clicks on nodes.  A function taking two 
         *  arguments: the tree node clicked on and the event object generated by
         *  the click. */
        nodeDblClickHandler: null,

    };

    function gentreeViewer(parent, tag, options) {
	/** @public */
        function setOptions(options) {
	    updateOptions(params, options, GentreeViewerDefaults, false);
        }

        /** @private */
        function treeKey(proxyNode) {
            return proxyNode.tree.uid;
        }

        /** @private */
        function labelKey(proxyNode) {
            return proxyNode.tree.uid;
        }

        /** @private */
        function edgeKey(edgeProxy) {
            var n0 = edgeProxy.source; n1 = edgeProxy.target;
            return n0.tree.uid + ":" + n1.position;
        }

        /** @private */
        function eraseNodes(exitNodes) {
            exitNodes.remove();
        }

        function eraseLabels(exitNodes) {
            exitNodes.remove();
        }

	function eraseEdges(exitNodes) {
	    exitNodes.remove();
	}

	function currentNodeUpdates(nodes) {
	    return d3.select(nodesGroupSel).selectAll("rect")
                .data(nodes, treeKey);
        }

        function currentLabelUpdates(nodes) {
            return d3.select(labelsGroupSel).selectAll("text")
                .data(nodes, labelKey);
        }

        function currentEdgeUpdates(edges) {
            return d3.select(edgesGroupSel).selectAll("line")
                .data(edges, edgeKey);
        }

	/** @public */
        function draw(tree, cont) {
            d3.select(nodesGroupSel).selectAll("*").remove();
            d3.select(labelsGroupSel).selectAll("*").remove();
            d3.select(edgesGroupSel).selectAll("*").remove();

            width = height = 0;
            var layout = layoutTree(tree);
            var nodes = layout.nodes, edges = layout.links;

	    if (svgSel !== null) 
		d3.select(svgSel).attr("width", width).attr("height", height);

            drawNodes(currentNodeUpdates(nodes).enter());
            drawLabels(currentLabelUpdates(nodes).enter());
            drawEdges(currentEdgeUpdates(edges).enter());

	    if (cont)
	        cont();
        }

        /** @public */
	function update(tree, cont) {
            var layout = layoutTree(tree);
            var nodes = layout.nodes, edges = layout.links;

	    if (svgSel !== null) 
		d3.select(svgSel).attr("width", width).attr("height", height);

	    nodeUpdates = currentNodeUpdates(nodes);
	    var labelUpdates = currentLabelUpdates(nodes);
	    var edgeUpdates = currentEdgeUpdates(edges);

	    var sema = barrier();
	    sema.start();
	    updateNodes(nodeUpdates, sema);
	    updateLabels(labelUpdates, sema);
	    updateEdges(edgeUpdates, sema);
	    eraseNodes(nodeUpdates.exit());
	    eraseLabels(labelUpdates.exit());
	    eraseEdges(edgeUpdates.exit());
	    sema.setContinuation(function () {
		drawNodes(nodeUpdates.enter());
		drawLabels(labelUpdates.enter());
		drawEdges(edgeUpdates.enter());
		if (cont)
		    cont();
	    });
	    sema.finishAfterDelay(params.animateTime);
	}

	/** @private */
	function makeLayoutProxy(root) {
	    function copy(node, k) {
                var i;
                var children;
		if (node.arity() == 0)
                    children = null;
                else {
                    children = [];
                    for (i = 0; i < node.arity(); i += 1) {
                        children.push(copy(node.get(i), i));
                    }
                }
                return { tree: node, position: k, children: children };
	    }

	    return copy(root);
	}
	    
        function nodeWidth(node) {
            return params.unit * params.nodeWidth(node.tree, params);
        }

        /** @private */
        function separation(a, b) {
            return params.horizSep * params.unit 
                + 0.5 * (nodeWidth(a) + nodeWidth(b));
        }

	function layoutTree(root) {
	    var i;
            if (root == null) {
                width = params.width == "auto" ? 0 : params.width;
                height = 
                    Math.max(height,
                             params.height == "auto" ? 0 : params.height);
                return { nodes: [], links: [] };
            }

	    var proxy = makeLayoutProxy(root);

	    // FIXME: Refactor
	    var layout = d3.layout.tree();
            layout.size([1, 0.5]);
            layout.separation(separation);
	    var nodes = layout.nodes(proxy);
	    var links = layout.links(nodes);
            var nodeHeight = params.unit * params.nodeHeight;
            var dims = 
                proxyScaling(proxy, nodeWidth, separation);

            var sy, xshift;

	    if (params.width == "auto") {
                width = Math.max(dims.xhigh - dims.xlow, 0) 
                    + params.leftPad + params.rightPad;
                xshift = -dims.xlow;
            } else {
                width = params.width;
                xshift = width*0.5 - proxy.x*dims.scaling;
            }

            if (params.height == "auto")
                height = 
		Math.max(height,
			 (root.height() + 1) * params.unit * params.vertSep 
			 + params.topPad + params.bottomPad + nodeHeight)
            else
                height = Math.max(height, params.height);

            sy = params.unit * params.vertSep;

            for (i = 0; i < nodes.length; i += 1) {
                nodes[i].x = params.leftPad + xshift + nodes[i].x * dims.scaling;
                nodes[i].y = params.topPad + 0.5*nodeHeight + nodes[i].depth * sy;
            }

            var source, target, w, p, sep;
            for (i = 0; i < links.length; i += 1) {
                source = links[i].source;
                target = links[i].target;
                p = target.position;
                w = 0.5 * nodeWidth(source.tree);
                sep = 2*w / (source.children.length+1);
                links[i].x1 = source.x - w + (p+1) * sep;
                links[i].x2 = target.x;
                links[i].y1 = source.y + 0.5 * nodeHeight;
                links[i].y2 = target.y - 0.5 * nodeHeight;
            }

            return { nodes: nodes, links: links };

	}
	    
        /** @private */
        function drawNodes(proxyNodes) {
	    var rx = params.rx * params.unit;
	    var ry = params.ry == null ? rx : params.ry * params.unit;
            proxyNodes.append("svg:rect")
                .call(applyStyle, params.nodeStyle)
                .attr("class", "tree-node")
                .attr("width", nodeWidth)
                .attr("height", params.nodeHeight * params.unit)
                .attr("x", function (d) { return RD(d.x - 0.5 * nodeWidth(d)); })
                .attr("y", function (d) { return RD(d.y - 0.5 * params.nodeHeight * params.unit); })
                .on('click', handleClick)
                .on('dblclick', handleDblClick);
        }

        function drawLabels(proxyNodes) {
	    proxyNodes
                .filter(function (d) { return d.tree.getLabel() != null; })
                .append("svg:text")
                .attr("class", "node-label")
	        .attr("x", function (d) { return RD(d.x); })
	        .attr("y", function (d) { 
                    return RD(d.y + 0.5 * params.textHeight); })
	        .attr("style", "fill: black; text-anchor: middle")
	        .text(function (d) { 
		    return params.labelText(d.tree);
		})
                .on('click', handleClick)
                .on('dblclick', handleDblClick);
        }

        /** @private */
        function drawEdges(edges) {
            edges.append("svg:line")
                .call(applyStyle, params.edgeStyle)
                .attr("class", "tree-edge")
                .attr("x1", function (d) { return RD(d.x1); })
                .attr("y1", function (d) { return RD(d.y1); })
                .attr("x2", function (d) { return RD(d.x2); })
                .attr("y2", function (d) { return RD(d.y2); })
        }

        /** @private */
        function updateNodes(proxyNodes, sema) {
            proxyNodes
                .call(applyStyle, params.nodeStyle)
                .transition().duration(params.animateTime)
		.each('start', sema.start).each('end', sema.finish)
                .attr("width", nodeWidth)
                .attr("height", params.nodeHeight * params.unit)
                .attr("x", function (d) { return RD(d.x - 0.5 * nodeWidth(d)); })
                .attr("y", function (d) { return RD(d.y - 0.5 * params.nodeHeight * params.unit); });
        }

        function updateLabels(proxyNodes, sema) {
            proxyNodes.text(function (d) { 
		return params.labelText(d.tree);
            });
	    proxyNodes.transition().duration(params.animateTime)
		.each('start', sema.start).each('end', sema.finish)
                .attr("x", function (d) { return RD(d.x); })
	        .attr("y", function (d) { 
                    return RD(d.y + 0.5 * params.textHeight); });
        }

        /** @private */
        function updateEdges(edges, sema) {
            edges.call(applyStyle, params.edgeStyle)
                .transition().duration(params.animateTime)
		.each('start', sema.start).each('end', sema.finish)
                .attr("x1", function (d) { return RD(d.x1); })
                .attr("y1", function (d) { return RD(d.y1); })
                .attr("x2", function (d) { return RD(d.x2); })
                .attr("y2", function (d) { return RD(d.y2); })
        }

        function handleClick(d, i) {
            if (d.tree && params.nodeClickHandler)
                return params.nodeClickHandler(d.tree, d3.event);
        }

        function handleDblClick(d, i) {
            if (d.tree && params.nodeDblClickHandler)
                return params.nodeDblClickHandler(d.tree, d3.event);
        }

        var params = {};
        var width, height;

        tag = tag || parent + "-tree";

	width = height = 0;

        updateOptions(params, options, GentreeViewerDefaults, true);

	var svgTag, svgSel;
	var sel = "#" + tag;
	var nodesTag = tag + "-nodes";
	var labelsTag = tag + "-labels";
	var edgesTag = tag + "-edges";
	var nodesGroupSel = "#" + nodesTag;
	var labelsGroupSel = "#" + labelsTag;
	var edgesGroupSel = "#" + edgesTag;

        var P = d3.select("#" + parent);
        if (P.length == 0) 
            throw new Error("No element with id=" + parent);

	if (P.property("tagName") == "SVG") {
	    P.selectAll(sel).data([0]).enter().append("svg:g").attr("id", tag);
	    svgTag = svgSel = null;
	} else {
	    svgTag = tag + "-svg";
	    svgSel = "#" + svgTag;
	    P.append("svg").attr("version", "1.1")
		.attr("id", svgTag)
                .append("svg:g").attr("id", tag)
        }

	d3.select(nodesGroupSel).remove();
	d3.select(labelsGroupSel).remove();
	d3.select(edgesGroupSel).remove();
	var S = d3.select(sel);
	S.append("g").attr("id", nodesTag);
	S.append("g").attr("id", labelsTag);
	S.append("g").attr("id", edgesTag);

        return { draw: draw, update: update, setOptions: setOptions };

    }


    if (typeof treedemos == 'undefined') {
	treedemos = {
	    bintreeFactory: bintreeFactory,
            gentreeFactory: gentreeFactory,
            setKeyInput: setKeyInput,
            bintreeViewer: bintreeViewer,
            bintree2_4Viewer: bintree2_4Viewer,
            gentreeViewer: gentreeViewer,
            barrier: barrier,
	    randomGenerator: randomGenerator,
            updateInt: updateInt,
            updateIntFromInput: updateIntFromInput,
            DISP: DISP,
            DB: DB,
            DBN: DBN
	};
    }

})(jQuery);
