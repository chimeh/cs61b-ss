import org.junit.*;

import static org.junit.Assert.*;

/**
 * Created by jimmy on 2016-3-8.
 */
public class Quiz1Test {

    @org.junit.Test
    public void testClippedSum() throws Exception {
        assertEquals(Quiz1.clippedSum(new int[]{0, 1, 2, 3}, 20), 6);
    }
}