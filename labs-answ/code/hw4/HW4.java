/** Solutions to HW #4.  This file contains only definitions of string
 *  constants standing for patterns or formats.
 *
 *  Useful trick:  If a string gets too long for a line, you can break
 *  it into multiple strings joined together with '+', as in
 *      public static final String LONG =
 *           "My eyes are fully open to this awful situation. "
 *           + "I shall go at once to Roderick and make him an oration. "
 *           + "I shall tell him I've recovered my forgotten moral senses, "
 *           + "and don't give twopence halfpenney for any consequences.";
 *  @author
 */
public class HW4 {

    /* Problem 1 */
    /** A pattern that matches ',' followed by arbitrary whitespace. */
    public static final String DELIM_P1 = ",\\s*";
    /** A pattern that matches valid non-delimiter strings other
     *  than floating-point numbers. */
    public static final String OKSTRING_P1 =
        "\\G([^-.0-9,]+)";

    /* Problem 2 */
    /** A pattern that matches signed floating-point or integer
     *  numerals. */
    /*  注意 "\\G([0-9]+|[0-9]+[.][0-9]*|[.][0-9]*|[0-9]+[e]-?[0-9]*"是错误的，优先级错误, 导致1e2匹配成1
     * "\\G([0-9]+[.][0-9]*|[.][0-9]*|[0-9]+[e]-?[0-9]*" 才是正确的
     *
     */

    public static final String DOUBLE_P2 =
            "\\G([0-9]+[.][0-9]*"
                    + "|[.][0-9]*"
                    + "|[0-9]+[e]-?[0-9]+"
                    + "|[0-9]+)";
    /** A pattern that matches valid non-delimiter strings. */
    public static final String ANY_STRING_P2 =
        "([^-.0-9,]+)";

    /* Problem 3 */
    /** A pattern that matches a simple HTML markup. Group 1 matches
     *  the initial '/', if present.  Group 2 matches the tag.  Group
     *  3 matches the attribute name, if present.  Group 4 matches the
     *  attribute value (without quotes).  Group 5 matches the closing
     *  '/', if present. */
    /*正则表达式有优先级吗，为何这里需要问号*/
    public static final String HTML_P3 =
        "<(/)?([\\w]+)[\\s]*([\\w]+)?[\\s]*?[=]?[\\s]?\"?([\\w]+)?\"?(/)?>";

    /* Problem 4 */
    /** A format (in printf style) that places a string and a double
     *  in the format specified for problem 4. */
    public static final String FORMAT_P4 = "%-9s|%8.2f\n";

}
