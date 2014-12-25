
/* On the command line, compile with

      javac -g Shove.java

   and run with, e.g.

      java Shove 2 1 9 6 3 -2 7 0 19 -1

   to print

      2 1 9 6 3 -2 -1 7 0 19

*/

/** Example of the inner loop of insertion sorting. */
public class Shove {

    /** Print ARGS, the command line arguments (all integer numerals), with
     *  the last one moved left so that no smaller elements follow it. */
    public static void main(String[] args) {
        /* Command-line arguments are strings (sequences of characters),
         * but moveOver expects ints.  So, we use Integer.parseInt (a library
         * function) to convert the strings in ARGS (each of which should be
         * a valid decimal numeral, possibly negated) into ints. */
        int[] A = new int[args.length];
        for (int i = 0; i < args.length; i += 1) {
            A[i] = Integer.parseInt(args[i]);
        }
        moveOver(A);
        for (int s : A) {
            System.out.print(s + " ");
        }
        System.out.println();
    }


    /** Move A[A.length-1] to the first position, k, in A such that there
     *  are no smaller elements after it, moving all elements
     *  A[k .. A.length-2] over to A[k+1 .. A.length-1]. */
    static void moveOver(int[] A) {
        moveOver(A, A.length - 1);
    }

    /** Move A[U] to the first position, k<=U, in A such that there
     *  are no smaller elements after it, moving all elements
     *  A[k .. U-1] over to A[k+1 .. U]. */
    static void moveOver(int[] A, int U) {
        if (U > 0) {
            if (A[U - 1] > A[U]) {
                int tmp = A[U - 1]; A[U - 1] = A[U]; A[U] = tmp;
                moveOver(A, U - 1);
            }
        }
    }

}
