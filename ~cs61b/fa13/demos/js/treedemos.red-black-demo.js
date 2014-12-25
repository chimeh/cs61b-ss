(function($){

    var td = treedemos;
    var DB = td.treedemos;

    /* INSERTION */

    function topInsert(source, top, val) {
        var parent, tree, grand, accP;
        var zig, zag;
        var child, sibling;

        parent = top;
        tree = parent.getLeft();
        zig = top.left;
        zag = top.right;

        while (!tree.isEmpty()) {
            parent = tree;
            if (val < tree.getLabel()) {
                zig = tree.left;
                zag = tree.right;
            } else {
                zig = tree.right;
                zag = tree.left;
            }
            tree = zig.call(tree);
        }
        child = source.make(val, null, null, true);
        zig.call(parent, child);
        tree = parent;
        
        while (!(tree === top)) {
            if (tree.isBlack()) {
                if (child.isBlack() || 
                    (child.getLeft().isBlack() && child.getRight().isBlack()))
                    break;

                sibling = zag.call(tree);
                if (sibling.isRed()) {
                    source.markUndo(1);
                    tree.redden();
                    child.blacken();
                    sibling.blacken();
                } else {
                    if (zag.call(child).isRed()) {
                        source.markUndo(1);
                        child = zig.call(tree, zag.call(child).rotate());
                    }
                    if (zig.call(child).isRed()) {
                        source.markUndo(1);
                        grand = tree.getParent();
                        accP = tree.accessor();
                        tree = child.rotate();
                        accP.call(grand, tree);
                        source.markUndo(1);
                        tree.blacken();
                        zag.call(tree).redden();
                    }
                }
            }
            child = tree;
            zig = child.accessor();
            zag = child.siblingsAccessor();
            tree = child.getParent();
        }

        if (top.getLeft().isRed()) {
            source.markUndo(1);
            top.getLeft().blacken();
        }
    }

    /* DELETION */

    /** The node C is black and has a black depth that is deficient by one (unless
     *  it is the root).  P is its parent. Rebalance the tree as needed.
     *  @private */
    function adjustBlack(source, c, p) {
        if (c.isRed()) {
            source.markUndo(1);
            c.blacken();
            return;
        }
        if (!c.isEmpty() && c.getLeft().isRed() && c.getRight().isRed()) {
            source.markUndo(1);
            c.getLeft().blacken();
            c.getRight().blacken();
            return;
        }

        while (true) {
            if (p.getLabel() == null)
                return;
            
            var g, accP, zig, zag, sib, sib0;

            g = p.getParent();
            accP = p.accessor();

            zig = p.accessor(c);
            zag = p.siblingsAccessor(c);
            sib = zag.call(p);
            if (sib.isRed()) {
                source.markUndo(1);
                accP.call(g, sib.rotate());
                source.markUndo(1);
                sib.blacken();
                p.redden();
                g = sib;
                accP = zig;
                sib = zag.call(p);
            }

            /* Now sib is black */
            
            if (zig.call(sib).isRed()) {
                source.markUndo(1);
                sib0 = sib;
                sib = zig.call(sib).rotate();
                zag.call(p, sib);
                source.markUndo(1);
                sib0.redden();
                sib.blacken();
            }
            if (zag.call(sib).isRed()) {
                source.markUndo(1);
                accP.call(g, sib.rotate());
                source.markUndo(1);
                sib.setColor(p.isRed());
                sib = zag.call(sib);
                p.blacken();
                sib.blacken();
                return;
            } else if (p.isRed()) {
                source.markUndo(1);
                accP.call(g, sib.rotate());
                return;
            } else {
                source.markUndo(1);
                sib.redden();
                c = p;
                p = c.getParent();
            }
        }
    }     

    function remove(source, tree, node) {
        if (node.isEmpty() || tree.isEmpty())
            return false;

        function getLeast(tree) {
            while (!tree.getLeft().isEmpty())
                tree = tree.getLeft();
            return tree;
        }

        var val = Number(node.getLabel());
        if (tree.getLabel() == val) {
            if (tree === node) {
                var child;
                if (!tree.getLeft().isEmpty() && !tree.getRight().isEmpty()) {
                    var least = getLeast(tree.getRight());
                    tree.setLabel(least.getLabel());
                    least.setLabel(null);
                    source.markUndo(1);
                    tree.setColor(tree.isRed());
                    tree = least;
                }

                if (tree.getLeft().isEmpty())
                    child = tree.getRight();
                else 
                    child = tree.getLeft();

                var p = tree.getParent();
                source.markUndo(1);
                tree.replace(child);
                if (tree.isBlack())
                    adjustBlack(source, child, p);
                return true;
            } else {
                return remove(source, tree.getLeft(), node) || 
                    remove(source, tree.getRight(), node);
            }
        } else if (val < tree.getLabel())
            return remove(source, tree.getLeft(), node);
        else
            return remove(source, tree.getRight(), node);
    }

    function redBlackDemo(source, viewer, altView, vals) {
        var sentinel = source.make(null, null, null);
        var i;
        var interactionEnabled;
        var uid;

        uid = 1;

        function enableInteraction(val) {
            interactionEnabled = (val == null || val);
        }

        function update(cont) {
            if (altView)
                altView.draw(sentinel.getLeft());
            var time = $("#animationSpeed").slider("value");
            if (time == 0)
                viewer.draw(tree, cont);
            else {
                viewer.setOptions({ animateTime: time * 100 });
                viewer.update(sentinel.getLeft(), cont);
            }
        }

        function mkLabel(n) {
            if (typeof n == 'string' && n.match(/^[-.\d]+$/) === null)
                return null;
            var r = new Number(n);
            r.uid = String(uid);
            uid += 1;
            return r;
        }

        $(document).tooltip({ position: { my: "center bottom", 
                                          at: "center top-10" },
                              tooltipClass: "tooltip-style" });
        $(".demo").css("height", "5in");


        enableInteraction(false);
        $("#animationSpeed").slider({ orientation: "horizontal", animate: true,
                                      min: 0, max: 15, step: 1, value: 5 });

        $("#undoAll").button().click(function() {
            if (interactionEnabled) {
                enableInteraction(false);
                source.undoAll();
                update(enableInteraction);
            }
        });
        $("#undo").button().click(function() {
            if (interactionEnabled) {
                enableInteraction(false);
                source.undoToMark();
                update(enableInteraction);
            }
        });
        $("#redo").button().click(function() {
            if (interactionEnabled) {
                enableInteraction(false);
                source.redoToMark();
                update(enableInteraction);
            }
        });

        $("#undoMinor").button().click(function() {
            if (interactionEnabled) {
                enableInteraction(false);
                source.undoToMark(1);
                update(enableInteraction);
            }
        });
        $("#redoMinor").button().click(function() {
            if (interactionEnabled) {
                enableInteraction(false);
                source.redoToMark(1);
                update(enableInteraction);
            }
        });
        $("#redoAll").button().click(function() {
            if (interactionEnabled) {
                enableInteraction(false);
                source.redoAll();
                update(enableInteraction);
            }
        });
        viewer.setOptions({
            nodeDblClickHandler: function (node, evnt) {
                if (interactionEnabled) {
                    enableInteraction(false);
                    remove(source, sentinel.getLeft(), node);
                    source.markUndo();
                    update(enableInteraction);
                }
            }});
        td.setKeyInput("#insertion", function (elt, val) {
            function reenable() {
                $("#insertion").val("");
                enableInteraction(true);
            }

            if (interactionEnabled) {
                enableInteraction(false);
                var lbl = mkLabel($("#insertion").val());
                if (lbl === null)
                    reenable();
                else {
                    topInsert(source, sentinel, lbl);
                    source.markUndo();
                    update(reenable);
                }
            }
            return false;
        });

        function insert1() {
            if (i < vals.length) {
                topInsert(source, sentinel, mkLabel(vals[i]));
                source.markUndo();
                i += 1;
                update(insert1);
            }
        }

        i = 0;
        insert1();
        enableInteraction(true);
    }

    RED_BLACK_NODE_STYLE = {
        stroke: function (node) { return (node.isRed()) ? "red" : "black"; },
        'stroke-width': 3,
        opacity: 1.0,
        fill: "#ffffcc"
    };


    $(document).ready(function () {
        var viewer = td.bintreeViewer("tree1", null,
                                      { animateTime: 500, 
                                        width: 600, 
                                        nodeStyle: RED_BLACK_NODE_STYLE
                                      });
        var viewer2_4;
        viewer2_4 = null;
        d3.select("#tree2").each(function () { 
            viewer2_4 = td.bintree2_4Viewer("tree2", null,
                                            { nodeRadius: 0.15,
                                              animateTime: 500, 
                                              width: 600, 
                                              nodeStyle: {
                                                  stroke: 'black',
                                                  'stroke-width': 1,
                                                  opacity: 1,
                                                  fill: "#ffffcc" }
                                            }
                                           ); 
        });
        var source = td.bintreeFactory();
        redBlackDemo(source, viewer, viewer2_4,
                     [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
    });


})(jQuery);
