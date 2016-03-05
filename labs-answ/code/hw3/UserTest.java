import org.junit.*;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.*;

/**
 * Created by jimmy on 2016-3-5.
 */
public class UserTest {
    WeirdList w = new WeirdList(1, new WeirdList(2, new WeirdList(3, WeirdList.EMPTY)));
    @Before
    public void setUp() throws Exception {

    }

    @After
    public void tearDown() throws Exception {

    }

    @org.junit.Test
    public void testAdd() throws Exception {
        WeirdList wuser = User.add(w, 5);
        System.out.print(wuser.toString());
        assertThat(wuser.toString(), containsString("6 7 8"));
    }

    @Test
    public void testSum() throws Exception {
        int sum = User.sum(w);
        assertEquals(sum, 6);
        sum =User.sum(WeirdList.EMPTY);
        assertEquals(sum, 0);
    }
}