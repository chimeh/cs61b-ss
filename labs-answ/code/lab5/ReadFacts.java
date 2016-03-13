import java.util.Scanner;

import java.io.File;
import java.io.IOException;

import java.util.regex.MatchResult;
import java.util.regex.Pattern;

/** Demonstration of sentence reading for Project 1.
 *  @author
 */
class ReadFacts {

    /** Pattern describing sentences "<Name> is [not] the <Occupation>". */
    static final Pattern NAME_OCC_PATN =
        Pattern.compile("\\G\\W*([A-Z][A-Za-z]*)\\b\\s+is\\s+(not\\s+)?the\\s+(\\p{Lower}+)");

    /** Print out the sentences in the file named ARGS[0]. */
    public static void main(String... args) {
        if (args.length != 1) {
            System.err.println("Usage: java ReadFacts FILENAME");
            System.exit(1);
        }

        Scanner inp;
        try {
            inp = new Scanner(new File(args[0]));
        } catch (IOException e) {
            System.err.printf("Could not read %s.%n", args[0]);
            System.exit(1);
            return;
        }

        while (true) {
            if (inp.findInLine(NAME_OCC_PATN) != null) {
                MatchResult mat = inp.match();
                System.out.printf("%s|%s|%s\n",mat.group(1), mat.group(2), mat.group(3));
                String name = mat.group(1); // REPLACE
                boolean negated = mat.group(2) == null ? false : true; // REPLACE
                String occupation = mat.group(3); // REPLACE
                System.out.printf("%s is%s the %s.%n",
                                  name, negated ? " not" : "", occupation);
            } else if (false) { // CHANGE THIS TO A REAL TEST
                break;
            } else {
                String rest = ""; // REPLACE TO FETCH THE REST OF THE LINE
                if (true) { // CHANGE THIS TO A REAL TEST
                    System.out.println("<TRAILING GARBAGE ON LINE>");
                    break;
                }
            }
        }
    }
}
