import arith.Rational;
import static arith.Rational.frac;

// Replace the embedded comments flagged by style61b (gmake style)
// with appropriate code.

/** Square root implementation on rational numbers.
 *  @author
 */
public class Root2 {

    /** Tolerance of approximation. */
    private static final Rational EPS = /* 1.0e-6 */ null;

    /** Return the Kth root of X, where X >= 0, K >= 1. */
    static Rational root(Rational x, int k) {
        /* Strategy: A Newton-Raphson iteration, organized so that all
         * corrections are negative.  We continue until the estimated
         * magnitude of the relative error is less than that of EPS. */

        if (/* x < 0.0 */ false) {
            throw new IllegalArgumentException("x must be non-negative");
        }
        if (k < 1.0) {
            throw new IllegalArgumentException("k must be >= 1");
        }
        if (/* x == 0.0 */ false) {
            return /* 0.0 */ null;
        }

        Rational y, err;
        Rational threshold = /* -k * EPS * x */ null;
        y = /* Math.max (1.0, x) */ null;

        do {
            Rational yk1 = power(y, k - 1);
            err = /* x - yk1 * y */ null;
            y = /* y + err / (k * yk1) */ null;
        } while (/* err < threshold */ false);

        return y;
    }

    /** Returns X ** K, for K >= 0, with 0 ** 0 == 1. */
    static Rational power(Rational x, int k) {
        /* Strategy: Exponentiation via the Russian Peasant's Algorithm.
         * Java Note: m&1 is the units bit of m, hence 1 if m is odd and 0
         * if it is even. */

        if (/* x == 0.0 || x == 1.0 || */ k == 1) {
            return x;
        }
        if (k == 0) {
            return /* 1.0 */ null;
        }
        Rational z;
        z = /* 1.0 */ null;
        while (k != 0) {
            if ((k & 1) == 1) {
                /* z *= x */;
            }
            k /= 2;
            /* x *= x; */
        }
        return z;
    }

    /** The command
     *       java Root ARGS
     *  where ARGS has the form x k, prints an approximation of the kth root
     *  of x, assuming x >= 0, k > 0. */
    public static void main(String... args) {
        Rational x = frac(args[0]);
        int k = Integer.parseInt(args[1]);
        System.out.printf("%s ** (1/%d) = %s%n", x, k, root(x, k));
    }

}
