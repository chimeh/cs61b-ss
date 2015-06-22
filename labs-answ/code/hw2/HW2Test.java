/** java HW2Test should test the methods defined in Lists and Arrays.
 *  @author jimmy
 *  @date   2015-06-22
 */
 
 
import org.junit.Test;
import static org.junit.Assert.*;


public class HW2Test {

    /** Run all tests. */
    public static void main(String[] args) {
        // FILL THIS IN
        System.exit(jh61b.junit.textui.runClasses(HW2Test.class));
        
    }
    
    @Test public void naturalRuns() {
        int [][][] testmatrix = 
        {
            {{1}},
            {{1, 3}},
            {{1, 3, 7}},
            {{1, 3, 7}, {5}, {4, 6}},
            {{1, 3, 7}, {5}, {4, 6, 9, 10}},
            {{1, 3, 7}, {5}, {4, 6, 9, 10}, {-1}, {-3, -1, 64564}},
        };
        
        IntList[] L1 = new IntList[6];
        L1[0] = IntList.list(1);
        L1[1] = IntList.list(1, 3);
        L1[2] = IntList.list(1, 3, 7);
        L1[3] = IntList.list(1, 3, 7, 5, 4, 6);
        L1[4] = IntList.list(1, 3, 7, 5, 4, 6, 9, 10);
        L1[5] = IntList.list(1, 3, 7, 5, 4, 6, 9, 10, -1, -3, -1, 64564);
        
        for (int i = 0; i < testmatrix.length; i++) {
            IntList2 L1ret = Lists.naturalRuns(L1[i]);
            //System.out.print(L1ret.toString() + "\n");
            assertTrue("should be equal", Utils.equals(L1ret, testmatrix[i]));
        }
    }
    
    @Test public void catenate() {
        int [][] testcase = 
        {
            {-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
        };
        
        int [] expect = testcase[0];
        for (int i = 0; i <= testcase[0].length; i ++) {
            int[] a = Utils.subarray(testcase[0], 0, i);
            int[] b = Utils.subarray(testcase[0], i, testcase[0].length - i);
            System.out.print("catenate a:" + Utils.toString(a) + Utils.toString(b));
            int[] actual = Arrays.catenate(a, b);
            System.out.print("\t-->" + Utils.toString(actual) + "\n");
            assertArrayEquals("should be equal", expect, actual);
        }
    }
    
     @Test public void remove() {
        int [][] testcase = 
        {
            {-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
        };
        
        for (int i = 0; i <= testcase[0].length; i ++) {
            int[] a = Utils.subarray(testcase[0], 0, i);
            int[] b = Utils.subarray(testcase[0], i, testcase[0].length - i);
            System.out.print("remove: a:" + Utils.toString(a) + Utils.toString(b));
            int [] expect = b;
            int[] actual = Arrays.remove(testcase[0], 0, i);
            System.out.print("\t-->" + Utils.toString(actual) + "\n");
            assertArrayEquals("should be equal", expect, actual);
        }
    }
    
    @Test public void naturalRuns_array() {
        int [][][] testmatrix = 
        {
            {{1}},
            {{1, 3}},
            {{1, 3, 7}},
            {{1, 3, 7}, {5}, {4, 6}},
            {{1, 3, 7}, {5}, {4, 6, 9, 10}},
            {{1, 3, 7}, {5}, {4, 6, 9, 10}, {-1}, {-3, -1, 64564}},
        };
        
        int[][] A1 = new int[6][];
        A1[0] = new int[]{1};
        A1[1] = new int[]{1, 3};
        A1[2] = new int[]{1, 3, 7};
        A1[3] = new int[]{1, 3, 7, 5, 4, 6};
        A1[4] = new int[]{1, 3, 7, 5, 4, 6, 9, 10};
        A1[5] = new int[]{1, 3, 7, 5, 4, 6, 9, 10, -1, -3, -1, 64564};
        
        for (int i = 0; i < testmatrix.length; i++) {
            int[][] Aret = Arrays.naturalRuns(A1[i]);
            System.out.print("naturalRuns_array" + Utils.toString(testmatrix[i]) + "\t --> " + Utils.toString(Aret) + "\n");
            assertTrue("should be equal", Utils.equals(Aret, testmatrix[i]));
        }
    }
}
