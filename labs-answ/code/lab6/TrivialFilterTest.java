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
        this.testFactory(new ArrayList<Integer>(), 0);
        this.testFactory(new ArrayList<Integer>(), 1);
        this.testFactory(new ArrayList<Integer>(), 3);
        this.testFactory(new ArrayList<Integer>(), 30);
        this.testFactory(new ArrayList<Integer>(), (int)Math.random()%25);

    }
    private void testFactory(ArrayList<Integer> tv, int  size) {
        for (int i=0; i < size; i++) {
            tv.add(i);
        }
        TrivialFilter<Integer> tfiter = new TrivialFilter(tv.iterator());
        int j =0;
        for(Iterator<Integer> i = tfiter.iterator(); i.hasNext();) {
            Integer a = i.next();
            Integer b = tv.get(j);
            j++;
            //System.out.println(a + "=?" + b);
            assertEquals(a, b);
        }
    }
}