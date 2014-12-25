public class RemoveBSTNode {
    /** Removes the node with value VAL from the binary search tree T. */
    public static void removeBinarySearchTree(Node t, int val) {
	Node toRemove = find(t, val);
	if (toRemove == null) {
	    return;
	}
	if (toRemove.left == null || toRemove.right == null) {
	    simpleRemove(t);
	    return;
	}
	Node nextBiggest = toRemove.right;
	while (nextBiggest.left != null) {
	    nextBiggest = nextBiggest.left;
	}
	toRemove.value = nextBiggest.value;
	simpleRemove(nextBiggest);
    }

    /** Finds and returns the node with value VAL in node T. */
    public static Node find(Node t, int val) {
	if (t == null) {
	    return null;
	}
	if (val > t.value) {
	    return find(t.right, val);
	} else if (val < t.value) {
	    return find(t.left, val);
	} else {
	    return t;
	}
    }

    /** Removes node T when there are only zero or one children. */
    public static void simpleRemove(Node t) {
	if (t.left == null && t.right == null) {
	    if (t.parent.left == t) {
		t.parent.left = null;
	    } else {
		t.parent.right = null;
	    }
	    return;
	}
	if (t.right != null) {
	    if (t.parent.left == t) {
		t.parent.left = t.right;
	    } else {
		t.parent.right = t.right;
	    }
	    return;
	}
	if (t.left != null) {
	    if (t.parent.left == t) {
		t.parent.left = t.left;
	    } else {
		t.parent.right = t.left;
	    }
	}
    }
}

class Node {
    int value;
    Node left;
    Node right;
    Node parent;
}