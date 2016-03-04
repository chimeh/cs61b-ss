import org.junit.*;
import org.junit.Test;
import static org.hamcrest.CoreMatchers.containsString;

import static org.junit.Assert.*;

/**
 * Created by jimmy on 2016-3-4.
 */
public class WeirdListTest {

    WeirdList empty = WeirdList.EMPTY;
    WeirdList w = new WeirdList(1, new WeirdList(2, new WeirdList(3, WeirdList.EMPTY)));

    @Before
    public void setUp() throws Exception {

    }

    @After
    public void tearDown() throws Exception {

    }

    @org.junit.Test
    public void testLength() throws Exception {
        assertEquals(empty.length(), 0);
        assertEquals(w.length(), 3);
    }

    @Test
    public void testMap() throws Exception {
        WeirdList em = empty.map(new IntUnaryFunction() {
            public int apply(int x) {
                return 1 + x;
            }
        });
        assertSame("should be same.", WeirdList.EMPTY, em);
        assertThat(em.toString(), containsString(""));
        WeirdList wmap = w.map(new IntUnaryFunction() {
            public int apply(int x) {
                return 1 + x;
            }
        });
        //System.out.print(wmap.toString());
        assertThat(wmap.toString(), containsString("2 3 4"));

    }

    @Test
    public void testPrint() throws Exception {
        w.print();

    }
}