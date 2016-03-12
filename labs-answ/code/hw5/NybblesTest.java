import org.junit.*;
import org.junit.Test;

import static org.junit.Assert.*;
import java.util.Random;

/**
 * Created by jimmy on 2016-3-11.
 */
public class NybblesTest {

    @Before
    public void setUp() throws Exception {
    }

    @org.junit.Test
    public void testSize() throws Exception {

    }

    @Test
    public void testGet() throws Exception {
        Nybbles uut = new Nybbles(25);
        int[] data = new int[25];
        for(int i = 0; i < uut.size(); i++) {
            Random ran = new Random();
            data[i] =  ran.nextInt() % 8;
            if (ran.nextInt() % 2 == 0) {
                data[i] = -1 * ran.nextInt() % 9;
                if(data[i] > 0) {
                    data[i] *= -1;
                }
            }
            uut.set(i, data[i]);
            System.out.print(data[i] + " " + uut.get(i) + " ");
            System.out.println();
        }
        for(int i = 0; i < uut.size(); i++) {
            assertEquals(uut.get(i), data[i]);
        }
    }

    @Test
    public void testSet() throws Exception {
        Nybbles uut = new Nybbles(25);
        int[] data = new int[25];
        for(int i = 0; i < uut.size(); i++) {
            Random ran = new Random();
            data[i] =  ran.nextInt() % 8;
            if (ran.nextInt() % 2 == 0) {
                data[i] = -1 * ran.nextInt() % 9;
                if(data[i] > 0) {
                    data[i] *= -1;
                }
            }
            uut.set(i, data[i]);
            System.out.print(data[i] + " " + uut.get(i) + " ");
            System.out.println();
        }
        for(int i = 0; i < uut.size(); i++) {
            assertEquals(uut.get(i), data[i]);
        }
    }
}