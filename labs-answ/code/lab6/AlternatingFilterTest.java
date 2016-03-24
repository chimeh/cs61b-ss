import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;

import static org.junit.Assert.*;

/**
 * Created by jimmy on 2016-3-24.
 */
public class AlternatingFilterTest {
    @org.junit.Test
    public void testIterator() throws Exception {
        this.testFactory(new ArrayList<Integer>(), 0);
        this.testFactory(new ArrayList<Integer> (), 1);
        this.testFactory(new ArrayList<Integer> (), 2);
        this.testFactory(new ArrayList<Integer> (), 3);
        this.testFactory(new ArrayList<Integer> (), 30);
        this.testFactory(new ArrayList<Integer> (), (int)(Math.random()*100)%199);

    }
    private void testFactory(ArrayList<Integer> tv, int  size) {
        for (int i=0; i < size; i++) {
            tv.add((int)(Math.random()*100));
            System.out.print(tv.get(i) + " ");
        }
        System.out.println();
        int j = 0;
        AlternatingFilter<Integer> tfiter = new AlternatingFilter<>(tv.iterator());
        for(Iterator<Integer> i = tfiter.iterator(); i.hasNext();) {
            Integer a = i.next();
            System.out.print(a + " ");
            assertEquals(a, tv.get(j*2));
            j += 1;
        }
        System.out.println();
    }
}