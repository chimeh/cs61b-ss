/** Represents an array of integers each in the range -8..7.
 *  Such integers may be represented in 4 bits (called nybbles).
 *  @author
 */
public class Nybbles {
    /** Return an array of size N. */
    public Nybbles(int N) {
        // DON'T CHANGE THIS.
        _data = new int[(N + 7) / 8];
        _n = N;
    }

    /** Return the size of THIS. */
    public int size() {
        return _n;
    }

    /** Return the Kth integer in THIS array, numbering from 0.
     *  Assumes 0 <= K < N. */
    public int get(int k) {
        if (k < 0 || k >= _n) {
            throw new IndexOutOfBoundsException();
        } else {
            return /* REPLACE WITH ANSWER */ 0;
        }
    }

    /** Set the Kth integer in THIS array to VAL.  Assumes
     *  0 <= K < N and -8 <= VAL < 8. */
    public void set(int k, int val) {
        if (k < 0 || k >= _n) {
            throw new IndexOutOfBoundsException();
        } else if (val < -8 || val >= 8) {
            throw new IllegalArgumentException();
        } else {
            _data[ /* REPLACE WITH ANSWER */ 0 ] =
                /* REPLACE WITH ANSWER */ 0;
        }
    }

    // DON'T CHANGE OR ADD TO THESE.
    /** Size of current array (in nybbles). */
    private int _n;
    /** The array data, packed 8 nybbles to an int. */
    private int[] _data;
}
