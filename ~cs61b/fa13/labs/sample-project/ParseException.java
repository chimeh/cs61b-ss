
/** An exception that indicates some kind of problem reading calculator
 *  input.  The detail message should say something helpful. */
public class ParseException extends Exception {
  
  /** An exception with no detail message. */
  public ParseException () { }

  /** An exception with detail message MSG. */
  public ParseException (String msg) {
    super (msg);
  }

}
