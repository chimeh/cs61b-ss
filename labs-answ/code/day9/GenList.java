public class GenList {
	/** Points to a permanent dummy node whose next pointer 
	 *  is the first item in the list and whose prev pointer
	 *  is the last. When empty, next and prev point to sentinel. */
	private ListNode sentinel;

	/** An empty list */
	public GenList () {
		sentinel = new ListNode (null, null, null);
		sentinel.next = sentinel.prev = sentinel;
	}

	/** True iff THIS is an empty list. */
	public boolean isEmpty () { return sentinel == sentinel.next; }

	/** Add an item to the front of the list */
	public void addFirst (Object x) {
		sentinel.next = sentinel.next.prev = 
			new ListNode (x, sentinel, sentinel.next);
	}

	/** Add an item to the end of the list */
	public void addLast (Object x) {
		sentinel.prev = sentinel.prev.next =
			new ListNode (x, sentinel.prev, sentinel);
	}

	/** The Kth item in THIS list, or -Kth from the end if K<0. */
	public Object get (int k) {
		ListNode p;
		if (k < 0) {
			p = sentinel.prev;
			while (k < -1 && p != sentinel) {
				k += 1;
				p = p.prev;
			}
		} else {
			p = sentinel.next;
			while (k > 0 && p != sentinel) {
				k -= 1;
				p = p.next;
			}
		}
		if (p == sentinel)
			new IndexOutOfBoundsException ();
		return p.val;
	}

	/** Destructively move all even-numbered items in THIS to
	 *  EVENS, deleting the previous contents of EVENS. */
	void unzip (GenList evens) {
		// FILL IN
	}

	private static class ListNode {
		Object val;
		ListNode next, prev;
		ListNode (Object x, ListNode prev, ListNode next) {
			this.next = next; this.prev = prev; val = x;
		}
	}
}
