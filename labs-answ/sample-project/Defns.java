import algebra.Polynomial;

/** A Defns represents a set of definitions of the form
 *    X(F1,F2,...,Fn) = P
 *  where X is an upper-case letter, Fi a sequence of 0 or more distinct 
 *  variable names, and P a polynomial. */
class Defns {
  /** The current definition of NAME, which must be an upper-case letter,
   *  or null if NAME is currently undefined. */
  Polynomial getDefn (char name) {
    return defn[name - 'A'];
  }

  /** The formal parameters that appear in the definition of NAME, in
   *  the order specified by put (below), or null if NAME is currently
   *  undefined.  NAME must be an upper-case letter. */
  String getVars (char name) {
    return formals[name - 'A'];
  }

  /** Set the getDefn (NAME) to be E, and set getVars (NAME) to be VARS. 
   *  NAME must be an upper-case letter. */
  void put (char name, String vars, Polynomial e) {
    defn[name - 'A'] = e; 
    formals[name - 'A'] = vars;
  }

  private Polynomial[] defn = new Polynomial[26];
  private String[] formals = new String[26];
}

