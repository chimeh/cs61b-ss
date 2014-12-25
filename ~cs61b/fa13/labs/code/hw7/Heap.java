import java.util.ArrayList;

/** A Heap of T ordered with largest element first.
 *  @author */
class Heap<T extends Comparable<? super T>> {
    /** The heap data.  The children of element # K in data are at
     *  locations 2K+1 and 2K+2, when those locations are valid (K>=0).
     */
    private final ArrayList<T> data = new ArrayList<T>();

    /** Add X to the heap. */
    void add(T x) {
        data.add(x);
        reheapifyUp(data.size() - 1);
    }

    /** Print all values in THIS that are >= X on the
     *  standard output, one per line. */
    void printLarger(T x) {
        // FILL IN
    }

    /** Restore the heap property, assuming that it may be violated only
     *  at K (a position in the array 'data') and K's parent. */
    private void reheapifyUp(int k) {
        T v = data.get(k);
        for (int p = k; k > 0; k = p) {
            p = (k - 1) / 2;
            if (v.compareTo(data.get(p)) > 0) {
                data.set(k, data.get(p));
            } else {
                break;
            }
        }
        data.set(k, v);
    }

}
