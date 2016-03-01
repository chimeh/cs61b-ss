import javax.imageio.IIOException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * Created by jimmy on 2016-2-29.
 */
public class TrReaderTest {
    public static void main(String[] args) {
        Reader in = new InputStreamReader(System.in);
        TrReader translation = new TrReader(in, "abcd", "ABCD");
        while (true) {
            try {
                int c = translation.read();
                System.out.print("" + (char)c + "");
            } catch (IIOException e){
                try {
                    translation.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
