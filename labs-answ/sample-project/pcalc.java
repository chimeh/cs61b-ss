/* Polynomial calculator.
 * Author: P. N. Hilfinger
 */

import algebra.Polynomial;
import java.io.*;

public class pcalc {

  /** Input from terminal as a stream of tokens. */
  private StreamTokenizer inp;

  public static void main(String[] ignored) {
    System.out.println ("pcalc polynomial calculator, Class Demo v1.1.");
    new pcalc ().process (new InputStreamReader (System.in));
  }

  /** Perform read-eval-print on the input stream R. */
  private void process (Reader r) {
    inp = new StreamTokenizer (r);
    setSyntax (inp);
    prompt ();

    try {
      inp.nextToken ();
    Loop:
      while (true) {
	try {
	  switch (inp.ttype) {
	  case StreamTokenizer.TT_EOF: 
	    break Loop;

	  case StreamTokenizer.TT_EOL:
	    prompt ();
	    skip (inp);
	    break;

	  case StreamTokenizer.TT_WORD:
	    if (inp.sval.equals ("DEF"))
	      doDefine (inp);
	    else if (inp.sval.equals ("QUIT") || inp.sval.equals ("EXIT"))
	      break Loop;
	    else 
	      doEvalPrint (inp);
	    break;

	  case '#': {
	    int c;
	    do {
	      c = inp.nextToken ();
	    } while (c != StreamTokenizer.TT_EOF 
		     && c != StreamTokenizer.TT_EOL);
	    if (c == StreamTokenizer.TT_EOF)
	      break Loop;
	    break;
	  }
	  case '?':
	    printHelp ();
	    skip (inp);
	    break;

	  default:
	    doEvalPrint (inp);
	    break;
	  }
	} catch (ParseException e) {
	  System.err.println ("ERROR: " + e.getMessage ());
	  recover (inp);
	} catch (IllegalArgumentException e) {
	  System.err.println("ERROR: " + e.getMessage ());
	}
      }
    } catch (IOException e) {
      System.err.println("unknown input error.");
      System.exit(1);
    }
    
    System.exit (0);
  }

  /** Discard input to next semicolon and print the discarded input as
   *  part of an error message. */
  void recover (StreamTokenizer inp) {
    try {
      System.err.print ("  [Skipping to ';': ");
      while (true) {
	switch (inp.ttype) {
	case StreamTokenizer.TT_NUMBER: 
	  System.err.print ((long) inp.nval + " ");
	  break;
	case StreamTokenizer.TT_WORD:
	  System.err.print (inp.sval + " ");
	  break;
	case StreamTokenizer.TT_EOL:
	  System.err.println ();
	  System.err.println ("[skipping]> ");
	  System.err.flush ();
	  break;
	case StreamTokenizer.TT_EOF:
	  return;
	case ';':
	  System.err.println ("]");
	  skip (inp);
	  return;
	default:
	  System.err.print ((char) inp.ttype);
	  break;
	}
	inp.nextToken ();
      } 
    } catch (IOException e) { }
  }

  /** Print help message */
  void printHelp () {
    /*
      System.out.println 
      ("<expr>;             evaluate and simplify <expr>\n" 
      + "DEF <name>(<var>,...,<var>) = <expr>;\n"
      + "                  define named polynomial\n"
      + "QUIT   or   EXIT  leave program\n"
      + "# ....            comment to end of line\n"
      + "   <name> is upper-case letter\n"
      + "   <var>  is lower-case letter\n"
      + "   <expr>  is <term> +- <term> ... \n"
      + "   where <term> is <factor><exp> <factor><exp> ...\n"
      + "     where <factor> is integer or <var> or (<expr>) or\n"
      + "                       <name>(<expr>,...) and\n"
      + "           optional <exp> is ^number"); */
    System.out.println ("Sorry; if you want this command, you'll have to "
			+ "write your own message!");
  }			

  /** Skip past any ends of lines on INP, positioning it to a 
   *  token that is not an EOL. */
  void skipEOLs (StreamTokenizer inp) throws IOException {
    while (inp.ttype == StreamTokenizer.TT_EOL) {
      prompt ();
      inp.nextToken ();
    }
  }

  /** Parse, evaluate, and print a polynomial (delimited by ';') from INP. 
   *  Leaves INP positioned to the delimiting ';' */
  void doEvalPrint (StreamTokenizer inp) 
    throws IOException, ParseException 
  {
    legalVarSet = ALL_VARIABLES;
    System.out.println ("= " + parseExpr (inp));
    skip (inp, ';');
  }

  /** Read the next token on INP that is not an end-of-line, discarding the 
   *  current token, if any. */
  void skip (StreamTokenizer inp) throws IOException {
    inp.nextToken ();
    skipEOLs (inp);
  }

  /** Check that current token on INP is TOKEN, and read the next token
   *  on INP that is not an end-of-line, discarding the current token. 
   *  Throws ParseException if the expected token is not in INP. */
  void skip (StreamTokenizer inp, int token) 
    throws IOException, ParseException 
  {
    if (inp.ttype != token)
      syntaxError ("expected '" + (char) token + "'");
    inp.nextToken ();
    skipEOLs (inp);
  }

  /* Parsing polynomials.  The following routines form a
   * recursive-descent parser.  For each major syntactic category---
   * expression, term, factor, and substitution---there is a function
   * below.  By convention, each takes a StreamTokenizer that
   * is positioned to the first symbol (number, parenthesis, variable,
   * etc.) of what the function is supposed to translate, yields
   * a Polynomial that corresponds to what it translates, and
   * moves the StreamTokenizer to the symbol that follows.  

   * For example, if INP is currently positioned at the beginning of
   * "3x y^2 (z+1) + 10z" (that is, INP.ttype will be TT_NUMBER and
   * INP.nval will be 3) and you call parseTerm(INP), you are supposed
   * to get back a Polynomial that stands for 3xy^2z + 3xy^2 and INP
   * is supposed to be positioned at the "+" in "+ 10z" (that is, INP.ttype
   * will be '+').   */

  /** Assuming that INP is positioned at the first token of a polynomial
   *  expression, returns a Polynomial denoted by that expression.  Positions
   *  inp to the token just after the expression that is read in.  Throws
   *  ParseException if there is any kind of error in translation, or 
   *  IOException if there is trouble reading from INP. */
  private Polynomial parseExpr (StreamTokenizer inp) 
    throws IOException, ParseException 
  {
    Polynomial r;
    if (inp.ttype == '-') {
      skip (inp);
      r = parseTerm (inp);
      r = r.mult (Polynomial.constant (-1));
    }
    else
      r = parseTerm (inp);
    while (true) {
      switch (inp.ttype) {
      case ';':	case ')': case ',':
	return r;
      case '+':
	skip (inp);
	r = r.add (parseTerm (inp));
	break;
      case '-':
	skip (inp);
	r = r.sub (parseTerm (inp));
	break;
      default:
	throw new IllegalArgumentException ("syntax error");
      }
    }
  }

  /** Assuming that INP is positioned at the first token of a
   *  polynomial term (a product of variables, constants, and
   *  substitutions), returns a Polynomial denoted by that expression.
   *  Positions inp to the token just after the term that is read in.
   *  Throws ParseException if there is any kind of error in
   *  translation, or IOException if there is trouble reading from
   *  INP. */
  private Polynomial parseTerm (StreamTokenizer inp) 
    throws IOException, ParseException  
  {
    Polynomial r = parseFactor (inp);
    while (true) {
      switch (inp.ttype) {
      case ';': case '+': case '-': case ')': case ',':
	return r;
      default:
	r = r.mult (parseFactor (inp));
      }
    }
  }
	
  /** Assuming that INP is positioned at the first token of a
   *  polynomial factor (a variable, number, or substitution), returns
   *  a Polynomial denoted by that factor.  Positions inp to the token
   *  just after the factor that is read in.  Throws ParseException if
   *  there is any kind of error in translation, or IOException if
   *  there is trouble reading from INP. */
  private Polynomial parseFactor (StreamTokenizer inp) 
    throws IOException, ParseException 
  {
    Polynomial p;
    p = null;
    switch (inp.ttype) {
    case '(': {
      skip (inp);
      p = parseExpr (inp);
      skip (inp, ')');
      break;
    }
    case StreamTokenizer.TT_NUMBER: {
      p = Polynomial.constant ((long) inp.nval);
      skip (inp);
      break;
    }
    case StreamTokenizer.TT_WORD:
      p = parseSubst (inp);
      break;
    default:
      if (inp.ttype >= 'a' && inp.ttype <= 'z') {
	if (legalVarSet.indexOf ((char) inp.ttype) == -1)
	  syntaxError ("'" + (char) inp.ttype 
		       + "' is not a legal variable here");
	p = Polynomial.var ((char) inp.ttype);
	skip (inp);
	break;
      } else
	syntaxError ("expected factor");
    }
    if (inp.ttype == '^') {
      skip (inp);
      if (inp.ttype != StreamTokenizer.TT_NUMBER) 
	syntaxError ("positive integer must follow '^'");
      p = p.expon ((int) inp.nval);
      skip (inp);
    }
    return p;
  }

  /** Assuming that INP is positioned at the first token of a
   *  substitution (such as A(x+y, 3)), returns the Polynomial resulting
   *  from that substitution.  Positions inp to the token
   *  just after the closing ')' that is read in.  Throws ParseException if
   *  there is any kind of error in translation, or IOException if
   *  there is trouble reading from INP. */
  private Polynomial parseSubst (StreamTokenizer inp) 
    throws IOException, ParseException 
  {
    if (inp.sval.length () != 1)
      syntaxError ("invalid polynomial name: " + inp.sval);
    char name = inp.sval.charAt (0);
    skip (inp);
    if (defns.getDefn (name) == null)
      syntaxError ("no definition of " + name);
    String args = defns.getVars (name);
    
    Polynomial[] actuals = new Polynomial[26];
    skip (inp, '(');
    int k;
    k = 0;
    while (inp.ttype != ')') {
      if (k > 0)
	skip (inp, ',');
      if (k >= args.length ())
	syntaxError ("too many arguments to " + name);
      actuals[args.charAt (k) - 'a'] = parseExpr (inp);
      k += 1;
    }
    if (k < args.length ())
      syntaxError ("too few arguments to " + name);
    skip (inp, ')');

    return defns.getDefn (name).subst (actuals);
  }

  /** Assuming that INP is positioned to a "DEF" token, parses a 
   *  definition from INP, updating defns with the result and 
   *  positioning INP at the closing ';'. */
  private void doDefine (StreamTokenizer inp) 
    throws IOException, ParseException 
  {
    skip (inp);
    String name = inp.sval;
    if (inp.ttype != StreamTokenizer.TT_WORD) 
      syntaxError ("invalid defined name: " + (char) inp.ttype);
    if (name.length () != 1) 
      syntaxError ("invalid defined name: " + name);
    char name0 = name.charAt (0);
    skip (inp);

    StringBuffer args = new StringBuffer ();
    skip (inp, '(');
    if (inp.ttype != ')')
      while (true) {
	if (inp.ttype < 'a' || inp.ttype > 'z')
	  syntaxError ("invalid formal parameter");
	args.append ((char) inp.ttype);
	skip (inp);
	if (inp.ttype == ')')
	  break;
	skip (inp, ',');
      }
    skip (inp, ')');
    String vars = args.toString ();
    for (int i = 0; i < vars.length (); i += 1)
      if (vars.indexOf (vars.charAt (i), i+1) != -1)
	syntaxError ("duplicate parameter: " + vars.charAt (i));
    skip (inp, '=');
    legalVarSet = vars;
    Polynomial expr = parseExpr (inp);
    skip (inp, ';');
    defns.put (name0, vars, expr);
  }

  /** Indicate a syntax error described by MSG. */
  private void syntaxError (String msg) throws ParseException {
    throw new ParseException (msg);
  }

  /** Print the prompt string. */
  private void prompt () {
    System.out.print ("> ");
    System.out.flush ();
  }

  /** Set the syntax for INP so that
   *  (a) Numbers are parsed;
   *  (b) Consecutive upper-case letters are returned as words (e.g.,
   *      DEF, QUIT, A, etc.);
   *  (c) All whitespace is ignored, except to terminate words and 
   *      numbers;
   *  (d) All other characters are returned (in INP.ttype) individually.
   */
  private void setSyntax (StreamTokenizer inp) {
    inp.resetSyntax ();
    inp.whitespaceChars ('\000', ' ');
    inp.eolIsSignificant (true);
    inp.parseNumbers ();
    inp.ordinaryChar ('-');
    inp.wordChars ('A', 'Z');
  } 

  /** The set of polynomial definitions. */
  private Defns defns = new Defns ();
  /** The set of all possible variables. */
  private static final String ALL_VARIABLES = "abcdefghijklimnopqrstuvwxyz";
  /** The current set of legal variable names */
  private String legalVarSet;
}

