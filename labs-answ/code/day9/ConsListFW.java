
import java.util.List;
import java.util.AbstractList;

public class ConsList extends AbstractList<Object> {

	/** An empty ConsList. */
	public ConsList () {
		myHead = null;
		// More might go here.
	}

	/** The size of THIS. */
	public int size () {
		// REPLACE WITH SOLUTION
		return 0;
	}

	/** Item #K of THIS.  Throws IndexOutOfBoundsException if K < 0 or
	 *  K >= size (). */
	public Object get (int k) {
		// REPLACE WITH SOLUTION
		return null;
	}

	/** Make X the new value of get (K), renumbering any existing elements 
	 *  #j >= K to #j+1.  Throws IndexOutOfBoundsException if K < 0 or
	 *  K > size(). */
	public void add (int k, Object x) {
		// INSERT SOLUTION HERE.
	}

	/** Remove item #K, returning its value.   Throws IndexOutOfBoundsException
	 *  if K < 0 or K >= size (). */
	public Object remove (int k) {
		// REPLACE WITH SOLUTION
		return null;
	}

	/** Set item #K of THIS to X, returning the value previously at that
	 *  index.  Throws IndexOutOfBoundsException if K < 0 or
	 *  K >= size (). */
	public Object set (int k, Object x) {
		// REPLACE WITH SOLUTION
		return null;
	}

	/* Only private members beyond this point. */

	private ConsNode myHead;

	// Other instance variables and private methods might go here.

	static private class ConsNode {

		// These are public to be consistent with Scheme.
		public Object myCar;
		public ConsNode myCdr;

		public ConsNode (Object car, ConsNode cdr) {
			myCar = car;
			myCdr = cdr;
		}

		public ConsNode (Object car) {
			this (car, null);
		}
	}

}

