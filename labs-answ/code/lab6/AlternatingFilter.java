import java.util.Iterator;
import utils.Filter;

/** A kind of Filter that lets through every other VALUE element of
 *  its input sequence, starting with the first.
 *  @author jimmy
 *  @date 2016-03-24
 */
class AlternatingFilter<Value> extends Filter<Value> {

    /** A filter of values from INPUT that lets through every other
     *  value. */
    AlternatingFilter(Iterator<Value> input) {
        super(input);
        this.on = false;

    }

    @Override
    protected boolean keep() {
        on = !on;
        return on;
    }

    private boolean on;

}
