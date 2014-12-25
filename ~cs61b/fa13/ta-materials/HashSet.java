import java.util.LinkedList;
import java.util.ArrayList;
public class HashSet<T> {
    int numBuckets;
    ArrayList<LinkedList<T>> buckets;
    float loadFactor;
    int numKeys;
    public HashSet(float lf) {
        numBuckets = 10;
        buckets = new ArrayList<LinkedList<T>>(numBuckets);
        for (int i = 0; i < numBuckets; i++)
            buckets.add(i, new LinkedList<T>());
        loadFactor = lf;
        numKeys = 0;
    }

    /** Adds the given OBJECT of type T to your HashSet.
     *  If numKeys / numBuckets > loadFactor then double your numBuckets
     *  and the size of your keys array. Resize is implemented for you. */
    public void add(T object) {
	numKeys += 1;
	if (numKeys / (float) numBuckets > loadFactor) {
	    resize(numBuckets * 2);
	}
	int hash = object.hashCode();
	buckets.get(hash % numBuckets).add(object);
    }

    /** Resizes the HashSet to have NEWSIZE number of buckets. */
    public void resize(int newSize) {
	numBuckets = newSize;
	numKeys = 0;

        ArrayList<LinkedList<T>> oldBuckets = buckets;
        buckets = new ArrayList<LinkedList<T>>(newSize);
        for (int i = 0; i < newSize; i++)
            buckets.add(i, new LinkedList<T>());
        for (LinkedList<T> bucket : oldBuckets)
            for (T key : bucket)
                add(key);
    }

    /** Checks if the HashSet contains the given OBJECT. */
    public boolean contains(T object) {
	int hash = object.hashCode();
	return buckets.get(hash % numBuckets).contains(object);
    }
    /** Deletes the given OBJECT from the HashSet. */
    public void delete(T object) {
	numKeys --;
	int hash = object.hashCode();
	buckets.get(hash % numBuckets).remove(object);
    }
}

