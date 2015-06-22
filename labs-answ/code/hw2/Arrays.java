/* NOTE: The file ArrayUtil.java contains some functions that may be useful
 * in testing your answers. */

/** HW #2, Problem #2. */

/** Array utilities.
 *  @author jimmy
 *  @date 2015-06-22
 */
class Arrays {
    /* 2a. */
    /** Returns a new array consisting of the elements of A followed by the
     *  the elements of B. */
    static int[] catenate(int[] A, int[] B) {
        /* *Replace this body with the solution. */
        int[] ret = new int[A.length+B.length];
        
        if (A == null || B == null) {
            int[] src = (A == null ? B:A);
            intcopy (ret, 0, src, 0, src.length);
            return ret;
        }
        intcopy (ret, 0, A, 0, A.length);
        intcopy (ret, A.length, B, 0, B.length);
        return ret;
    }
    /** copy {src[sfrom]... src[sto-1]}, to dst[dfrom] ...
     *   */
    private static int[] intcopy(int[] dst, int dfrom, int[] src, int sfrom, int sto) {
        if (dst == null) {
            throw new IllegalArgumentException("dst null");
        }
        if (src == null) {
            return dst;
        }
        if (sto > src.length || sfrom > sto) {
            throw new IllegalArgumentException("sfrom:" + sfrom + "sto:" + sto + "len:" + src.length);
        }
        for (int i = 0; i < sto - sfrom; i +=1) {
            dst[dfrom + i] = src[sfrom + i];
        }
        return dst;
    }
    
    /* 2b. */
    /** Returns the array formed by removing LEN items from A,
     *  beginning with item #START. */
    static int[] remove(int[] A, int start, int len) {
        /* *Replace this body with the solution. */
        /* should not out of bound */
        if (start < 0 || start > A.length - 1) {
            throw new IllegalArgumentException(start +" "+ len);
        }
        if (start + len > A.length) {
            throw new IllegalArgumentException(start +" " + len);
        }
        int[] ret = new int[A.length - len];
        intcopy(ret, 0, A, 0, start);
        if (start + len <= A.length) {
            intcopy(ret, start, A, start + len, A.length);
        }
        return ret;
    }
    
    /* 2c. */
    /** Returns the array of arrays formed by breaking up A into
     *  maximal ascending lists, without reordering.
     *  For example, if A is {1, 3, 7, 5, 4, 6, 9, 10}, then
     *  returns the three-element array
     *  {{1, 3, 7}, {5}, {4, 6, 9, 10}}. */
    static int[][] naturalRuns(int[] A) {
        /* *Replace this body with the solution. */
        int[][] tmpret = new int[A.length][];  /* don't know diamension, how to deal, cast ? or have another method */
        
        if (A.length == 0) {
            return new int[0][0];
        }
        
        if (A.length == 1) {
            return new int[][] {{A[0]},};
        }
        /* A.length > 1 */
        int n = 0;
        int ascstart = 0;
        int ascend = 1;
        for (; ascend <= A.length - 1; ascend += 1) {
            if (A[ascend] < A[ascend-1]) {
                /* the sep point */
                int[] newasc = new int[ascend - ascstart];
                intcopy(newasc, 0, A, ascstart, ascend);
                tmpret[n] = newasc;
                n += 1;
                ascstart = ascend;
            }
        }
        tmpret[n] = intcopy(new int[ascend - ascstart], 0, A, ascstart, ascend);
        n += 1;
        
        int[][] ret = new int[n][];
        for (int i = 0; i < n; i++) {
            ret[i] = tmpret[i];
        }
        return ret;
    }
}
