/* NOTE: The file Utils.java contains some functions that may be useful
 * in testing your answers. */

/** HW #2, Problem #1. */

/** List problem.
 *  @author
 */
class Lists {
    /** Return the list of lists formed by breaking up L into "natural runs":
     *  that is, maximal ascending sublists, in the same order as
     *  the original.  For example, if L is (1, 3, 7, 5, 4, 6, 9, 10),
     *  then result is the three-item list ((1, 3, 7), (5), (4, 6, 9, 10)).
     *  Destructive: creates no new IntList items, and may modify the
     *  original list pointed to by L. */
    static IntList2 naturalRuns(IntList L) {
        /* *Replace this body with the solution. */
        IntList2 result = new IntList2(null, null);
        if (L == null) {
            return result.tail;
        }
        IntList s = L;
        IntList2 d = result;
        while(s != null) {
            s = cutnewasc(L);
            IntList2 e = new IntList2(L, null);
            d.tail = e;
            d = d.tail;
            L = s;
        }
        return result.tail;
    }
    /** Breaking up L into two part: first sublist meet "natural runs" and remain list ,
     *  return remain: that is, maximal ascending sublists, in the same order as
     *  the original.  For example, if s is (1, 3, 7, 5, 4, 6, 9, 10),
     *  then result is two part: s become(1, 3, 7),remain =  (5, 4, 6, 9, 10).
     */
    static IntList cutnewasc(IntList s) {
        IntList ret;
        if(s == null) {
        return s;
        }
        else {
            for (; s.tail != null && s.head  <= s.tail.head; s = s.tail) {
            }
            ret = s.tail;
            s.tail = null;
            return ret;
        }
    }
        /** Returns a readable String for THIS. */
    static String toString(IntList2 L2) {
        StringBuffer b = new StringBuffer();
        b.append("[");
        for (IntList2 e = L2; e != null; e = e.tail) {
            b.append(e.head.toString() + ",");
        }
        b.append("]");
        return b.toString();
    }
}
