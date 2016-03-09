import org.junit.*;

import java.security.SecureRandom;
import java.util.Random;

import static org.junit.Assert.*;
import static java.lang.System.out;

/**
 * Created by jimmy on 2016-3-9.
 */
public class AdderTest {

    @org.junit.Test
    public void testAdd() throws Exception {
        SecureRandom random = new SecureRandom();
        assertEquals(Adder.add(0, 0), 0);
        assertEquals(Adder.add(0, 1), 1);
        assertEquals(Adder.add(1, 0), 1);
        assertEquals(Adder.add(0, 2), 2);
        assertEquals(Adder.add(2, 0), 2);
        assertEquals(Adder.add(0, 3), 3);
        assertEquals(Adder.add(3, 0), 3);

        for (int i = 0; i < 30; i++){
            int a= random.nextInt();
            int b= random.nextInt();
            int expect = a + b;
            int result = Adder.add(a, b);
            out.printf("%#x + %#x expect=%#x, actual=%#x\n", a, b, expect, result);
            assertEquals(expect, result);
        }
    }
}
