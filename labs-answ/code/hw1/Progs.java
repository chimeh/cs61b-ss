/** HW #1 solutions.
 *
 *  @author huangjimin
 */
class Progs {

    /* 1a. */
    /** Returns the sum of all integers, k, such that 1 <= k < N and
     *  N is evenly divisible by k. */
    static int factorSum(int N) {
        /* *Replace the following with the answer* */
        int sum = 0;
        int k = N - 1;
        while(k >= 1) {
            if(divisible(N, k)) {
                sum += k;
            }
            k--;
        }
        return sum;
    }

    private static boolean divisible(int num, int divisor) {
        if((num / divisor) * divisor == num) {
            return true;
        }
        else {
            return false;
        }
    }

    /* 1b. */
    /** Print the set of all sociable pairs whose members are all
     *  between 1 and N>=0 (inclusive) on the standard output (one pair per
     *  line, smallest member of each pair first, with no repetitions). */
    static void printSociablePairs(int N) {
        /* *Fill in here* */
        int fi = 0;
        int ffi = 0;
        for(int i=0; i<=N; i++) {
            fi = factorSum(i);
            ffi = factorSum(fi);
            if(ffi == i && ffi <= N) {
                if(i < fi) {
                    System.out.printf("%d %d\n", i, fi);
                }
            }
        }
    }

    /* 2a. */
    /** Returns a list consisting of the elements of A followed by the
     *  elements of B.  May modify items of A. Don't use 'new'. */
    static IntList dcatenate(IntList A, IntList B) {
        /* *Replace the following with the answer* */
        IntList p;
        if(A == null) {
            return B;
        }
        else {
            p = A.tail;
            while(p.tail != null) {
                p = p.tail;
            }
            p.tail = B;
        }
        return A;
    }

    static private void checkArg(IntList L, int start, int len) {
        if (L == null && len > 0) {
            throw new IllegalArgumentException("List don't have enough elem");
        }
        if (len < 0) {
            throw new IllegalArgumentException("START+LEN beyond list bound");
        }

        if (start < 0) {
            throw new IllegalArgumentException("START beyond list bound");
        }
    }
    /* 2b. */
    /** Returns the sublist consisting of LEN items from list L,
     *  beginning with item #START (where the first item is #0).
     *  Does not modify the original list elements.
     *  It is an error if the desired items don't exist. */
    static IntList sublist(IntList L, int start, int len) {
        /* *Replace the following with the answer* */
        checkArg(L, start, len);
        if(len == 0){
            return null;
        }
        if(start == 0){
            return new IntList(L.head, sublist(L.tail, start, len -1));
        }

        return sublist(L.tail, start-1, len);
    }

    /* 2c. */
    /** Returns the sublist consisting of LEN items from list L,
     *  beginning with item #START (where the first item is #0).
     *  May modify the original list elements. Don't use 'new'.
     *  It is an error if the desired items don't exist. */
    static IntList dsublist(IntList L, int start, int len) {
        /* *Replace the following with the answer* */
        checkArg(L, start, len);
        /*  */
        if(start == 0 && len == 0) {
            L = null;
            return L;
        }
        if(start == 0 && len == 1) {
            L.tail = null;
            return L;
        }
        else if(start == 0 && len > 0) {
            dsublist(L.tail, start, len - 1);
            return L;
        }
        else {
            return dsublist(L.tail, start -1, len);
        }

    }

}
