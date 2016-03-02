import javax.imageio.IIOException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;

/** String translation. */
public class Translate {
    /** Return the String S, but with all characters that occur in FROM
     *  changed to the corresponding characters in TO. FROM and TO must
     *  have the same length. */
    static String translate(String S, String from, String to) {
        /* NOTE: The try {...} catch is a technicality to keep Java happy. */
        char[] buffer = new char[S.length()];
        TrReader rd = new TrReader(new StringReader(S), from, to);
        try {

            if(-1 == rd.read(buffer, 0, S.length()))
                throw new IOException();
            // REPLACE ABOVE LINE WITH THE RIGHT ANSWER.
        } catch (IOException e) { return null; }
        return new String(buffer);
    }
    /*
       REMINDER: translate must
      a. Be non-recursive
      b. Contain only 'new' operations, and ONE other method call, and no
         other kinds of statement (other than return).
      c. Use only the library classes String, and anything containing
         "Reader" in its name (browse the on-line documentation).
    */
}
class TanslateTest {
    public static void main(String[] args) {
        System.out.print(Translate.translate("", "", ""));
        System.out.println();
        System.out.print(Translate.translate("q", "", ""));
        System.out.println();
        System.out.print(Translate.translate("QE", "", ""));
        System.out.println();
        System.out.print(Translate.translate("abc123", "", ""));
        System.out.println();
        System.out.print(Translate.translate("abcabc", "a", "A"));
        System.out.println();
       System.out.print(Translate.translate("aabbccdd123qwerQWER", "abcd", "ABCD"));
    }
}