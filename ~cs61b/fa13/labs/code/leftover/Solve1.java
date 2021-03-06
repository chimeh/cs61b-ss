import java.util.Scanner;

import static linalg.LinearEqn1.dsolve;

public class Solve1 {

    /** Read in a system of linear equations from the standard input and 
     *  print the solution, if possible.  The system 
     *      a11 x1 + a12 x2 + ... + a1n xn = b1
     *      a21 x1 + a22 x2 + ... + a2n xn = b2
     *      ...
     *      an1 x1 + an2 x2 + ... + ann xn = bn
     *  is represented by the input
     *      n
     *      a11 a12 ... a1n b1
     *      a21 a22 ... a2n b2
     *      ...
     *      an1 an2 ... ann bn
     *  where all the aij and bi are Java floating-point numerals and
     *  n is a positive integer numeral. */
    public static void main (String... args) {
        Scanner inp = new Scanner (System.in);

        int N = inp.nextInt ();
        double A[][] = new double[N][N];
        double b[] = new double[N];

        for (int i = 0; i < N; i += 1) {
            for (int j = 0; j < N; j += 1)
                A[i][j] = inp.nextDouble ();
            b[i] = inp.nextDouble ();
        }

        try {
            double[] x = dsolve (A, b);
            for (int i = 0; i < N; i += 1)
                System.out.printf ("x[%d] = %g; ", i+1, x[i]);
            System.out.println ();
        } catch (IllegalArgumentException e) {
            System.err.printf ("Error: %s%n", e.getMessage ());
            return;
        }

    }

}

        