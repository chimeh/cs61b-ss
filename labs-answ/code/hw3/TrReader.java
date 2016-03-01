import java.io.IOException;
import java.io.Reader;

/** Translating Reader: a stream that is a translation of an
 *  existing reader. */
public class TrReader extends Reader {
    private Reader rd;
    private String from;
    private String to;


    /** A new TrReader that produces the stream of characters produced
     *  by STR, converting all characters that occur in FROM to the
     *  corresponding characters in TO.  That is, change occurrences of
     *  FROM.charAt(0) to TO.charAt(0), etc., leaving other characters
     *  unchanged.  FROM and TO must have the same length. */
    public TrReader(Reader str, String from, String to) {
        super(str);
        this.from = from;
        this.to = to;
        if (str == null)
            throw new NullPointerException("Reader");
        this.rd = str;
    }

    public int read(char[] cbuf, int off, int len) throws IOException {
        int c;
        int index;
        int i;
        for(i=0; i < len && i < cbuf.length; i++) {
            c = rd.read();
            if(c == -1)
                break;
            else {
                index = from.indexOf(c, 0);
                cbuf[i] = (index == -1) ? (char) c :to.charAt(index);
            }
        }
        return i;
    }

    @Override
    public void close() throws IOException {
        rd.close();
    }
// FILL IN
    // NOTE: Until you fill in the right methods, the compiler will
    //       reject this file, saying that you must declare TrReader
    //     abstract.  Don't do that; define the right methods instead!
}


