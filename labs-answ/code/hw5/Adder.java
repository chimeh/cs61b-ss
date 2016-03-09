/** An alternative addition procedure.
 *  @author jimmy
 */
public class Adder {
    /** Returns X+Y. */
    public static int add(int x, int y) {
        int carryi = 0;
        int result = 0;
        for (int i = 0; i < 32; i += 1) {
            /*注意表达式中的变量左移并不会更新变量 */
//            result |= (x ^ y ^ (carryi<<1)) & (1 << i);
//            carryi = (x&y& (1 << i)) | (x&carryi& (1 << i)) | (y&carryi& (1 << i));
            result |= (x ^ y ^ carryi) & (1 << i);
            carryi = (x&y& (1 << i)) | (x&carryi& (1 << i)) | (y&carryi& (1 << i));
            carryi = carryi<<1;
        }
        return result;
    }

}


