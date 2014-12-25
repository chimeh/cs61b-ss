package arith;

/** A rational number.  Members of this class, like the Integer and Double
 *  wrapper classes, are immutable.  Operations create new Rational objects
 *  rather than modifying existing ones.
 *  @author
 */
public class Rational {
    // WARNING! Currently, this class is incomplete and has at least one
    // bug.

    /** Return the rational number NUM/DEN, where DEN is non-zero. */
    public static Rational frac(long num, long den) {
        return new Rational(num, den);   // ??
    }

    /** Returns the rational number X. */
    public static Rational frac(long x) {
        return frac(x, 1);
    }

    /** Returns the rational number denoted by VAL, which must be of the form
     *  NUM/DEN, +NUM/DEN, -NUM/DEN, +NUM, or -NUM for NUM and DEN
     *  integer numerals and DEN a non-zero integer numeral. */
    public static Rational frac(String val) {
        return null; // ??
    }

    /** Returns the value N, where THIS, in lowest terms, is N/D, and D>0. */
    public long numer() {
        return _num;
    }

    /** Returns the value D, where THIS, in lowest terms, is N/D, and D>0. If N
     *  is 0, returns 1. */
    public long denom() {
        return _den;
    }

    /** Returns my representation as a String.  Returns a String of the form
     *  N/D or -N/D, where N/D is a fraction in lowest terms, leaving off /D
     *  when D is 1. */
    public String toString() {
        if (_den == 1) {
            return String.format("%d", _num);
        } else {
            return String.format("%d/%d", _num, _den);
        }
    }

    /** I represent NUM/DEN, which are kept in lowest terms. */
    private final long _num, _den;

    /** A new Rational number whose value is NUM/DEN. */
    private Rational(long num, long den) {
        _num = num;
        _den = den;
    }

    /** Returns the positive greatest common divisor (X,Y) if X!=0 or
     *  Y!=0, or 0 if both X and Y are 0.  (X,Y) is defined as the
     *  largest positive integer that divides both X and Y. */
    private static long gcd(long x, long y) {
        x = Math.abs(x);
        y = Math.abs(y);
        if (x > y) {
            x %= y;
        }
        while (x != 0) {
            long t = x;
            x = y % x;
            y = t;
        }
        return y;
    }

}
