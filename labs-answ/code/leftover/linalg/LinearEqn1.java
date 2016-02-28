package linalg;

/** A simple linear-equation-solving package. */
public class LinearEqn1 {

    /** Assuming A is an NxN matrix, N > 0, and b is a vector of length N,
     *  Solve Ax = b, returning the result if it exists, and also leaving it
     *  in b.  The operation is destructive; the original contents of A and 
     *  b are lost.  Singularity detection is minimal; a (near) singular 
     *  matrix may raise an exception or leave NaNs or infinities in the 
     *  result. */
    public static double[] dsolve (double[][] A, double[] b) {
        /* Strategy: First, put the equations in upper-triangular form
         * (all 1's on the diagonal and 0's below).  Then, starting at 
         * the last equation (which will be xn = C), use substitution
         * to find the x's.  We don't bother to actually set the elements on
         * the diagonal or the lower triangle of A. */

        int N = A.length;

        if (b.length != N)
            throw new IllegalArgumentException ("incompatible arguments");
        for (double[] row : A)
            if (row.length != N)
                throw new IllegalArgumentException ("non-square matrix");

        for (int i = 0; i < N; i += 1) {
            pivot (A, b, i);
            double diag = A[i][i];
            if (diag == 0.0)
                throw new IllegalArgumentException ("singular matrix");
            for (int j = i+1; j < N; j += 1)
                A[i][j] /= diag;
            b[i] /= diag;
            for (int k = i+1; k < N; k += 1) {
                for (int j = i+1; j < N; j += 1)
                    A[k][j] -= A[k][i] * A[i][j];
                b[k] -= A[k][i] * b[i];
            }
        }

        for (int i = N-2; i >= 0; i -= 1) {
            for (int j = i+1; j < N; j += 1)
                b[i] -= b[j] * A[i][j];
        }

        return b;
    }

    /** Assuming A is an NxN matrix, N > 0, and b is a vector of length N,
     *  Solve Ax = b, returning the result if it exists, and leaving A and 
     *  b undisturbed.  Singularity detection is minimal; a (near) singular 
     *  matrix may raise an exception or leave NaNs or infinities in the 
     *  result. */
    public static double[] solve (double[][] A, double[] b) {
        int N = A.length;
        double[][] A1 = new double[N][];
        for (int i = 0; i < N; i += 1)
            A1[i] = A[i].clone ();
        double[] b1 = b.clone ();
        return dsolve (A1, b1);
    }

    /** Find the row of A with the largest |A[k][I]|, where k>=I, swap
     *  it with row A[I], and swap b[I] and b[k]. */
    private static void pivot (double[][] A, double[] b, int i) {
        int N = A.length;
        int ip;
        double max;
        max = Math.abs (A[i][i]);
        ip = i;
        for (int k = i+1; k < N; k += 1)
            if (max < Math.abs (A[k][i])) {
                max = Math.abs (A[k][i]);
                ip = k;
            }
        double[] row = A[i];
        A[i] = A[ip];
        A[ip] = row;
        double t = b[i];
        b[i] = b[ip];
        b[ip] = t;
    }

}
