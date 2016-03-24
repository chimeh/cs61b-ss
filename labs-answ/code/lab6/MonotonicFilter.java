import java.util.Comparator;
import java.util.Iterator;
import utils.Filter;

/** A kind of Filter that lets all the VALUE elements of its input sequence
 *  that are larger than all the preceding values to go through the
 *  Filter.  So, if its input delivers (1, 2, 3, 3, 2, 1, 5), then it
 *  will produce (1, 2, 3, 5).
 *  @author You
 */
class MonotonicFilter<Value> extends Filter<Value> {

    /** A filter of values from INPUT that delivers a monotonic
     *  subsequence.  */
    MonotonicFilter(Iterator<Value> input, Comparator<Value> cmp) {
        super(input);
        this.premax = null;
        this.cmp = cmp;
    }

    @Override
    protected boolean keep() {
        int r;
        if (premax == null) {
            premax = this._next;
            return true;
        }
        r = cmp.compare(this._next, premax);
        if (r <= 0) {
            return false;
        } else {
            premax = this._next;
            return true;
        }
    }


    private Value premax;
    private Comparator<Value> cmp;

}
