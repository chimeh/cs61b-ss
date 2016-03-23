import org.junit.*;

import java.util.ArrayList;
import java.util.Iterator;

import static org.junit.Assert.*;

/**
 * Created by jimmy on 2016-3-22.
 */
public class TrivialFilterTest {

    @org.junit.Test
    public void testIterator() throws Exception {
        ArrayList<Integer> tv = new ArrayList();
        for (int i=0; i < 30; i++) {
            tv.add(i);
        }
        TrivialFilter<Integer> tfiter = new TrivialFilter(tv.iterator());
        int j =0;
        for(Iterator<Integer> i = tfiter.iterator(); i.hasNext();) {
            Integer a = i.next();
            j++;
            Integer b = tv.get(j);
            assertEquals(a, b);
            System.out.print(a + "=?" + b);
        }
    }
}