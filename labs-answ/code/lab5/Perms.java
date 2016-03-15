import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.function.Consumer;

/** Generating permutations.
 *  @author jimmy
 *  @date 2016-03-15
 */
public class Perms {

    /** Assumes that ARGS[0] denotes a positive integer N.  Prints
     *  all permutations of 0 .. N-1, one per line. */
    public static void main(String... args) {
        int N = Integer.parseInt(args[0]);

        int[] A = new int[N];
        for (int i = 0; i < N; i += 1) {
            A[i] = i;
        }

        do {
            printArr(A);
        } while (nextPerm(A));

    }

    /** Print elements of B on one line, separated by spaces. */
    static void printArr(int[] B) {
        for (int i : B) {
            System.out.print(i);
            System.out.print(" ");
        }
        System.out.println();
    }

    /** Permute A to its next permutation, if possible.  Returns true
     *  if there is such a permutation, and false otherwise. */
    static boolean nextPerm(int[] A) {
        int N = A.length;
        int k = N - 1;
        ArrayList<Integer> S= new ArrayList<Integer>();
        Comparator<Integer> IntCmp = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return o1.compareTo(o2);
            }
        };

        while (k >= 0) {
            int v=0;
            S.sort(IntCmp);
            if (!S.isEmpty() &&  S.get(S.size()-1) > A[k]) {
                for (Integer I: S){
                    if(I > A[k]){
                        v = I;
                        break;
                    }
                }
                S.remove(S.indexOf(v));
                S.add(A[k]);
                A[k] = v;
                S.sort(IntCmp);
                for(int i=0;i<S.size();i++) {
                    A[k+1+i] = S.get(i);
                }
                return true;
            } else {
                S.add(A[k]);
                k -= 1;
            }
        }
        return false;
    }
}
/*
    next_permutation(A):
        k = N-1
        S = { }
        while k >= 0:
        if S contains a value larger than A[k]:
        v = the smallest member of S that is larger than A[k]
        remove v from S
        insert A[k] in S
        A[k] = v
        A[k+1:N-1] = the values in S in ascending order.
        return true
        else:
        insert A[k] in S
        k -= 1
        return false*/
