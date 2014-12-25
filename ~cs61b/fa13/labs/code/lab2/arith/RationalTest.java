package arith;

import org.junit.Test;
import static org.junit.Assert.*;

import static arith.Rational.*;

/** Unit tests for class Rational.
 *  @author
 */
public class RationalTest {

    /* Run the unit tests in this file. */
    public static void main(String... args) {
        System.exit(ucb.junit.textui.runClasses(RationalTest.class));
    }

    @Test public void frac1() {
        Rational r = frac(36, 48);
        assertEquals("numer() should be in lowest terms",
                     3, r.numer());
        assertEquals("denom() should be in lowest terms",
                     4, r.denom());
    }

    @Test public void frac2() {
        Rational r = frac(0, 20);
        assertTrue("0 should be 0/1", r.numer() == 0 && r.denom() == 1);
    }

    @Test(expected = IllegalArgumentException.class)
    public void frac3() {
        frac(3, 0);
    }

}



