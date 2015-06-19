package arith;

/** A rational number.  Members of this class, like the Integer and Double
 *  wrapper classes, are immutable.  Operations create new Rational objects
 *  rather than modifying existing ones.
 *  @author huangjimin
 */
public class Rational implements  Comparable<Rational> {
    // WARNING! Currently, this class is incomplete and has at least one
    // bug.

    /** Return the rational number NUM/DEN, where DEN is non-zero. */
    public static Rational frac(long num, long den) {
        if (den == 0) {
            throw new IllegalArgumentException("denominator can't eq 0");
        }
        if (num == 0) {
            return new Rational(0L, 1L);   
        }
        if (num < 0 && den < 0) {
            return new Rational(-num, -den);
        }
        long gcd = gcd(num, den);
        num = (den / Math.abs(den) * num) / gcd;
        den = Math.abs(den) / gcd;
        return new Rational(num, den);
    }

    /** Returns the rational number X. */
    public static Rational frac(long x) {
        return frac(x, 1);
    }

    /** Returns the rational number denoted by VAL, which must be of the form
     *  NUM/DEN, +NUM/DEN, -NUM/DEN, +NUM, or -NUM for NUM and DEN
     *  integer numerals and DEN a non-zero integer numeral. */
    public static Rational frac(String val) {
        long num = 0L;
        long den = 1L;
        int sep = val.indexOf('/');
        
        if (sep == -1) {
            num = Long.parseLong(val);
            den = 1L;
        }
        else {
            num = Long.parseLong(val.substring(0, sep - 1));
            den = Long.parseLong(val.substring(sep + 1));
        }
        return frac(num, den);
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
    
    public int compareTo(Rational val) {
        if (_num * val.denom() == _den * val.numer()) {
            return 0;   
        }
        else if (_num * val.denom() >  _den * val.numer()) {
            return 1;
        }
        else {
            return -1;
        }
    }
    
    public Rational abs(Rational val) {
        if (val.numer() < 0) {
            return frac(-val.numer(), val.denom());
        }
        else {
            return frac(val.numer(), val.denom());
        }
    }
    public Rational add(Rational val) {
        long snum = this.numer() * val.denom() + val.numer() * this.denom();
        long sden = this.denom() * val.denom();
        return frac(snum, sden);
    }
    public Rational sub(Rational val) {
        long snum = this.numer() * val.denom() - val.numer() * this.denom();
        long sden = this.denom() * val.denom();
        return frac(snum, sden);
    }
    public Rational div(Rational val) {
        long snum = this.numer() * val.denom();
        long sden = this.denom() * val.numer();
        return frac(snum, sden);
    }
    public Rational mul(Rational val) {
        long snum = this.numer() * val.numer();
        long sden = this.denom() * val.denom();
        return frac(snum, sden);
    }
    public Rational max(Rational val) {
        if (this.numer() * val.denom() - val.numer() * this.denom() > 0) {
            return this;
        }
        else {
            return val;
        }
    }
    public Rational min(Rational val) {
        if (this.numer() * val.denom() - val.numer() * this.denom() < 0) {
            return this;
        }
        else {
            return val;
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
