/* HW9, problem 1. */

/** A set of strings.
 *  @author */
public class TrieSet {

    /** An empty set. */
    public TrieSet() {
        root = new EmptyTrieNode();
    }

    /** Returns true iff THIS contains KEY. */
    public boolean contains(String key) {
        return root.contains(key, 0);
    }

    /** Add KEY to THIS.  Has no effect if KEY is already in THIS. */
    void add(String key) {
        root = root.insert(key, 0);
    }

    /** Root of the trie, representing the empty string. */
    private TrieNode root;

    /** A node of the trie. */
    private abstract static class TrieNode {

        /** Returns true iff THIS contains KEY, assuming that THIS is a
         *  TrieNode at level K in the entire tree (where the root is at
         *  level 0). Assumes that the length of KEY is at least K, and
         *  that THIS is the subtree that should contain KEY, if present. */
        abstract boolean contains(String key, int k);

        /** Insert KEY into THIS, if necesary, assuming that THIS is a TrieNode
         *  at level K in the entire tree (where the root is at level 0)
         *  Assumes that the length of KEY is at least K, and that THIS is
         *  the subtree that should contain KEY, if present. Returns
         *  the modified trie node. */
        abstract TrieNode insert(String key, int k);
    }

    /** Represents an empty trie. */
    private static class EmptyTrieNode extends TrieNode {
        @Override
        boolean contains(String key, int k) {
            // REPLACE WITH SOLUTION
            return false;
        }

        @Override
        TrieNode insert(String key, int k) {
            // REPLACE WITH SOLUTION
            return null;
        }
    }


    /** Represents a trie subtree that contains a single String. */
    private static class SingletonTrieNode extends TrieNode {
        /** The entire string represented by this leaf node. */
        private final String _key;

        /** A leaf trie node representing KEY. */
        SingletonTrieNode(String key) {
            _key = key;
        }

        @Override
        boolean contains(String key, int k) {
            // REPLACE WITH SOLUTION
            return false;
        }

        @Override
        TrieNode insert(String key, int k) {
            // REPLACE WITH SOLUTION
            return null;
        }
    }


    /** A nonleaf node in a trie. */
    private static class InnerTrieNode extends TrieNode {
        /** An inner node at level K (root is 0) that initially contains just
         *  the string contained in S. [It is convenient to do it this way
         *  because one always creates an inner node out of a singleton node,
         *  and the same singleton node moves down the tree.] */
        InnerTrieNode(SingletonTrieNode s, int k) {
            // REPLACE WITH SOLUTION
        }

        @Override
        boolean contains(String key, int k) {
            // REPLACE WITH SOLUTION
            return false;
        }

        @Override
        TrieNode insert(String key, int k) {
            // REPLACE WITH SOLUTION
            return null;
        }

        // Add instance variables here.
    }

}
