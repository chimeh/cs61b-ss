import java.util.*;

public class BinaryTree<Item> {

	private TreeNode<Item> myRoot;
	
	public BinaryTree ( ) {
		myRoot = null;
	}
	
	public BinaryTree (TreeNode<Item> t) {
		myRoot = t;
	}
	
	/** Print the values in the tree in preorder: root value first,
	 *  then values in the left subtree (in preorder), then values
	 *  in the right subtree (in preorder). */
	public void printPreorder ( ) {
		printPreorder (myRoot);
		System.out.println ( );
	}

	// We'll discuss the peculiar syntax below in a future lecture.  The
	// type parameter Item must be passed in as a "parameter" to each
	// static method, and this is how you do that.

	private static <Item> void printPreorder (TreeNode<Item> t) {
		if (t != null) {
			System.out.print (t.myItem + " ");
			printPreorder (t.left);
			printPreorder (t.right);
		}
	}

	/** Print the values in the tree in inorder: values in the left
	 *  subtree first (in inorder), then the root value, then values
	 *  in the right subtree (in inorder). */
	public void printInorder ( ) {
		printInorder (myRoot);
		System.out.println ( );
	}

	private static <Item> void printInorder (TreeNode<Item> t) {
		if (t != null) {
			printInorder (t.left);
			System.out.print (t.myItem + " ");
			printInorder (t.right);
		}
	}
	
	public static BinaryTree<String> sampleTree1 ( ) {
		return new BinaryTree<String> 
			(new TreeNode<String> ("a",
								   new TreeNode<String> ("b"),
								   new TreeNode<String> ("c")));
	}

	public static BinaryTree<String> sampleTree2 ( ) {
		return new BinaryTree<String> 
			(new TreeNode<String> 
			 ("a",
			  new TreeNode<String> ("b",
									new TreeNode<String> ("d",
														  new TreeNode<String> ("e"),
														  new TreeNode<String> ("f")),
									null),
			  new TreeNode<String> ("c")));
	}

	public static void main (String [ ] args) {
		print (new BinaryTree<String> ( ), "the empty tree");
		print (sampleTree1 ( ), "sample tree 1");
		print (sampleTree2 ( ), "sample tree 2");
	}

	private static <Item> void print (BinaryTree<Item> t, String description) {
		System.out.println (description + " in preorder");
		t.printPreorder ( );
		System.out.println (description + " in inorder");
		t.printInorder ( );
		System.out.println ( );
	}

	static class TreeNode<Item> {
		
		public Item myItem;
		public TreeNode<Item> left;
		public TreeNode<Item> right;
		
		public TreeNode (Item obj) {
			myItem = obj;
			left = right = null;
		}
		
		public TreeNode (Item obj, TreeNode<Item> left, TreeNode<Item> right) {
			myItem = obj;
			this.left = left;
			this.right = right;
		}
	}

  
	/** Iterates through all my TreeNodes in (depth-first) preorder. */
	// See lab section 8.3.1.
	public class DepthFirstIterator implements Iterator<TreeNode<Item>> {

		private Stack<TreeNode<Item>> fringe = new Stack<TreeNode<Item>> ( );

		public DepthFirstIterator ( ) {
			// Java fact.  Since DepthFirstIterator is an inner class of
			// BinaryTree, and has no "myRoot" member itself, 
			// "myRoot" here is shorthand for "BinaryTree.this.myRoot".
			if (myRoot != null) {
				fringe.push (myRoot);
			}
		}

		public boolean hasNext ( ) {
			return !fringe.empty ( );
		}

		public TreeNode<Item> next ( ) {
			if (!hasNext ( )) {
				throw new NoSuchElementException ("tree ran out of elements");
			}
			TreeNode<Item> node = fringe.pop ( );
			if (node.right != null) {
				fringe.push (node.right);
			}
			if (node.left != null) {
				fringe.push (node.left);
			}
			return node;
		}

		public void remove () {
			throw new UnsupportedOperationException ();
		}

	}


}

