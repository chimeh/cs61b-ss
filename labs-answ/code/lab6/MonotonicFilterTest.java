import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;

import static org.junit.Assert.*;

/**
 * Created by jimmy on 2016-3-24.
 */
public class MonotonicFilterTest {
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
        MonotonicFilter<Integer> tfiter = new MonotonicFilter<>(tv.iterator(), new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return Integer.compare(o1, o2);
            }
        });
        for(Iterator<Integer> i = tfiter.iterator(); i.hasNext();) {
            Integer a = i.next();
            System.out.print(a + " ");
            //assertEquals(a, b);
        }
        System.out.println();
    }
}