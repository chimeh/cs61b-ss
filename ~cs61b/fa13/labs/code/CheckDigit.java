public class CheckDigit {

    /**
     * Print message telling whether ARGS[0] is a legal id.  Assumes
     * that ARGS[0] does exist and is a legal numeral.
     */
    public static void main (String [ ] args) {
        for (String s : args) {
            int id = Integer.parseInt (s);
            boolean isLegal;
            // Replace the next line with your solution.
            isLegal = true;
            if (isLegal) {
                System.out.printf ("%d is legal%n", id);
            } else {
                System.out.printf ("%d is not legal%n", id);
            }
        }
    }

}
