(function($){
    var td = treedemos;
    var DB = td.DB;
    var DISP = td.DISP;

    var NODE_STYLE = {
        stroke: "black",
        "stroke-width": 1,
        opacity: 1.0,
	rx: function (node) {
	    if (node.arity() == 0)
		return 0;
	    else return 0.175*90.7;
	},
	ry: function (node) {
	    if (node.arity() == 0)
		return 0;
	    else return 0.175*90.7;
	},
		
        fill: "#ffffcc",
    };

    function trieDemo(source, viewer) {
        var cons = source.make;

        var tree;
        var interactionEnabled;

        function update(cont) {
            var time = $("#animationSpeed").slider("value");
            if (time == 0)
                viewer.draw(tree, cont);
            else {
                viewer.setOptions({ animateTime: time * 100 });
                viewer.update(tree, cont);
            }
        }

        function remove(text) {
            function remove1(node, k) {
                var i, p
                if (node == null)
                    return null;
                if (node.arity() == 0) {
                    if (node.getLabel() == text) 
                        return null;
                } else if (k == -1 || text.charAt(k) == node.getLabel()) {
                    for (i = 0; i < node.arity(); i += 1) {
                        p = remove1(node.get(i), k+1);
                        if (p === null) {
                            if (node.arity() == 1)
                                return null;
                            node.remove(i);
                            if (node.arity() == 1 && node.get(0).arity() == 0)
                                return node.get(0);
                            return node;
                        } else {
                            node.set(i, p);
                            if (node.arity() == 1 && node.get(0).arity() == 0)
                                return node.get(0);
                        }
                    }
                }
                return node;
            }
            tree = remove1(tree, -1);
        }
                    
        function insert(text) {
            function insert1(node, k) {
                var i, p;
		if (node === null)
		    return cons(text);
                if (node.arity() == 0) {
                    if (text == node.getLabel()) 
                        return node;
                    else if (k == -1 || 
			     text.charAt(k) == node.getLabel().charAt(k))
                        return insert2(node, k);
		    else 
			return null;
                } else if (k == -1 || text.charAt(k) == node.getLabel()) {
                    for (i = 0; i < node.arity(); i += 1) {
                        p = insert1(node.get(i), k+1);
                        if (p !== null) {
                            node.set(i, p);
                            return node;
                        }
                    }
                    node.add(cons(text));
                    return node;
                } else
                    return null;
            }

            function insert2(node, k) {
		return insert1(cons(k == -1 ? "" : node.getLabel().charAt(k), 
				    node), k);
            }

	    tree = insert1(tree, -1);
        }

        function enableInteraction(val) {
            interactionEnabled = (val == null || val);
            if (interactionEnabled) {
                $("#menu").menu("option", "disabled", false);
                $("#insertion").removeAttr('disabled');
            } else {
                $("#menu").menu("option", "disabled", true);
                $("#insertion").attr('disabled', 'true');
            }
        }

        $(document).tooltip({ 
            show: { effect: "fadeIn", delay: 2000, duration: 3000 },
            position: { my: "center bottom", at: "center top-10" },
        });
        $("#tree1").css("height", "5in");

        $("#animationSpeed").slider({ orientation: "horizontal", animate: true,
                                      min: 0, max: 15, step: 1, value: 5 });

        td.setKeyInput("#insertion", function (elt, val) {
            if (interactionEnabled) {
                enableInteraction(false);
                var str;
                str = $("#insertion").val().replace(/\s/g,"");
                if (str != "") {
                    str = str.replace(/\*/g, "");
                    insert(str + "*");
                }
                $("#insertion").val("");
		update(enableInteraction);
	    }
            return false;
        });

	var words =  [ "a*", "abase*", "abash*", "abate*", "abbas*", "axe*",
		       "axolotl*", "fabric*", "facet*" ];

	tree = null;
	for (var word in words)
	    insert(words[word]);
	update();

        viewer.setOptions({
            nodeDblClickHandler: function (node, evnt) {
                if (interactionEnabled) {
                    if (node.arity() == 0) {
                        enableInteraction(false);
                        remove(node.getLabel());
                        update(enableInteraction);
                    }
                }
            },
        });

        enableInteraction(true);
    }

    function nodeWidth(node) {
	if (node == null)
	    return 0;
	if (node.arity() == 0)
	    return 0.055 * node.getLabel().length + 0.25;
	else
	    return 0.4;
    }

    $(document).ready(function () {
        var viewer = td.gentreeViewer("tree1", null,
                                      { animateTime: 2000, 
					width: "auto", height: "auto",
                                        nodeWidth: nodeWidth,
                                        nodeHeight: 0.35,
                                        nodeStyle: NODE_STYLE });
        source = td.gentreeFactory();
        trieDemo(source, viewer);

    });

})(jQuery);
