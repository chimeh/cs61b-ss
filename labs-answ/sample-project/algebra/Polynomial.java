package algebra;
import java.util.List;
import java.util.ArrayList;

/* Author: P. N. Hilfinger */

/** 
 * A polynomial over the integers in any number of indeterminates. 
 */

public class Polynomial {

  /* PUBLIC INTERFACE */

  /** The polynomial consisting of just the constant term K. */
  public static Polynomial constant (long k) {
    if (k == 0)
      return new Polynomial ();
    else
      return new Polynomial (new Term (k));
  }

  /** The polynomial consisting of the single variable C, which must
   *  be a lower-case letter. */
  public static Polynomial var (char c) {
    return new Polynomial (new Term (1, c, 1));
  }

  /** The 0 polynomial */
  Polynomial () {
  }

  /** A polynomial equal to T. */
  Polynomial (Term t) {
    terms.add (new Term (t));
  }

  /** A fresh polynomial equal to P.  */
  Polynomial (Polynomial p) {
    for (int i = 0; i < p.terms.size (); i += 1)
      terms.add (new Term ((Term) p.terms.get (i)));
  }

  /** Returns THIS + Y.  THIS is not affected. */
  public Polynomial add (Polynomial y) {
    Polynomial r = new Polynomial (this);
  TermsOfY:
    for (int k = 0; k < y.terms.size (); k += 1) {
      Term t1 = (Term) y.terms.get (k);
      int j;
    Find:
      for (j = 0; j < r.terms.size (); j += 1) {
	Term t0 = (Term) r.terms.get (j);
	switch (t0.compareTo (t1)) {
	case 0:
	  t0.add (t1);
	  if (t0.coef == 0)
	    r.terms.remove (t0);
	  continue TermsOfY;
	case 1:
	  break Find;
	default: /* case -1 */
	  break;
	}
      }
      r.terms.add (j, t1);
    }
    return r;
  }

  /** Returns THIS - Y. THIS is not affected. */
  public Polynomial sub (Polynomial y) {
    return add (y.mult (constant (-1)));
  }

  /** Returns THIS x Y.  THIS is not affected. */
  public Polynomial mult (Polynomial y) {
    Polynomial result = constant (0);
    for (int i = 0; i < terms.size (); i += 1) {
      Term t0 = (Term) terms.get (i);
      for (int j = 0; j < y.terms.size (); j += 1) {
	Term t = new Term (t0);
	t.mult ((Term) y.terms.get (j));
	result = result.add (new Polynomial (t));
      }
    }
    return result;
  }

  /** Returns THIS ^ N, where N >= 0.  If N == 0, then THIS must not be
   *  the 0 polynomial. THIS is not affected. */
  public Polynomial expon (int n) {
    Polynomial r;
    if (n == 0 && terms.size () == 0)
      throw new IllegalArgumentException ("attempt to compute 0^0");
    r = constant (1);
    while (n > 0) {
      r = r.mult (this);
      n -= 1;
    }
    return r;
  }

  /** The result of simultaneously substituting the Polynomials 
   *  in SUBSTITUTION for the indeterminates in THIS.  SUBSTITUTION must
   *  be an array of 26 elements; SUBSTITUTION[0], if not null, is 
   *  substituted for all occurrences of variable 'a', SUBSTITUTION[1]
   *  for 'b', etc.  THIS is not affected. */
  public Polynomial subst (Polynomial[] substitution) {
    Polynomial result = constant (0);
    for (int i = 0; i < terms.size (); i += 1)
      result = result.add (((Term) terms.get (i)).subst (substitution));
    return result;
  }

  /** The external (human-readable) string representation of THIS in
   *  printed canonical form (see project handout). */
  public String toString () {
    if (terms.size () == 0)
      return "0";
    StringBuffer result = new StringBuffer ();
    result.append (terms.get (0).toString ());

    for (int i = 1; i < terms.size (); i += 1) {
      String t = terms.get (i).toString ();
      if (! t.startsWith ("-"))
	result.append ("+");
      result.append (t);
    }
    return result.toString ();
  }

  /** The canonical sequence of terms representing THIS.  An empty list
   *  represents 0.  Terms are not shared among Polynomials. */
  private List terms = new ArrayList ();

  /** A single factor of the form VAR^EXP */
  private static class Factor {
    char var;
    int exp;
    
    /** Represents VAR^EXP. */
    Factor (char var, int exp) {
      this.var = var; this.exp = exp;
    }

    /** A fresh copy of F. */
    Factor (Factor f) {
      this.var = f.var; this.exp = f.exp;
    }

    /** The result of performing the substitution SUBSTITUTION for the
     *  variables in THIS.  See the description of Polynomial.subst. */
    Polynomial subst (Polynomial[] substitution) {
      if (substitution[var - 'a'] == null)
	return new Polynomial (new Term (this));
      else
	return substitution[var - 'a'].expon (exp);
    }

    /** The canonical printed representation of THIS. */
    public String toString () {
      if (exp > 1) 
	return var + "^" + exp;
      else
	return "" + var;
    }

  }

  /** Type representing a single canonical term of a polynomial. */
  private static class Term {
    /** The coefficient of the term. */
    long coef;
    /** List of SimpleFactors (var^exp), in alphabetical order by
     *  variable name.  Factors are not shared among Terms. */
    List factors = new ArrayList ();

    /** The Term K. */
    Term (long k) {
      coef = k;
    }

    /** The Term K VAR^E. */
    Term (long k, char var, int e) {
      coef = k;
      factors.add (new Factor (var, e));
    }

    /** A fresh Term equal to F. */
    Term (Factor f) {
      coef = 1;
      factors.add (new Factor (f));
    }

    /** A fresh Term equal to T. */
    Term (Term t) {
      coef = t.coef;
      for (int i = 0; i < t.factors.size (); i += 1)
	factors.add (new Factor ((Factor) t.factors.get (i)));
    }

    /** Modify THIS by multiplying by S. */
    void mult (long s) {
      coef *= s;
    }

    /** Modify THIS by multiplying by S VAR^EXP. */
    void mult (long s, char var, int exp) {
      coef *= s;
      if (exp > 0) {
	((Factor) factors.get (findVar (var))).exp += exp;
      }
    }

    /** Modify THIS by multiplying by T. */
    void mult (Term t) {
      mult (t.coef);
      for (int k = 0; k < t.factors.size (); k += 1) {
	Factor f = (Factor) t.factors.get (k);
	mult (1, f.var, f.exp);
      }
    }

    /** Modify THIS by adding T, which must be a term such that
     *  compareTo (T) == 0. */
    void add (Term t) {
      coef += t.coef;
    }

    /** Modify THIS by subtracting T, which must be a term such that
     *  compareTo (T) == 0. */
    void sub (Term t) {
      coef -= t.coef;
    }

    /** The result of performing the substitution SUBSTITUTION for the
     *  variables in THIS.  See the description of Polynomial.subst. */
    Polynomial subst (Polynomial[] substitution) {
      Polynomial result = constant (coef);
      for (int i = 0; i < factors.size (); i += 1) 
	result = 
	  result.mult (((Factor) factors.get (i)).subst (substitution));
      return result;
    }

    /** The index of the Factor whose variable is VAR in factors.  If 
     *  there is no such Factor, creates one with an exponent of 0 and
     *  returns its index. */
    private int findVar (char var) {
      int i;
      for (i = 0; i < factors.size (); i += 1) {
	Factor f = (Factor) factors.get (i);
	if (var == f.var)
	  return i;
	if (var < f.var) {
	  factors.add (i, new Factor (var, 0));
	  return i;
	}
      }
      factors.add (i, new Factor (var, 0));
      return i;
    }

    /** Return -1, 1, or 0, depending on whether in canonical term order,
     *  THIS should come before T, after T, or be combined with T. */
    int compareTo (Term t) {
      int k;
      for (k = 0; k < t.factors.size (); k += 1) {
	if (k >= factors.size ())
	  return 1;
	Factor 
	  f0 = (Factor) factors.get (k),
	  f1 = (Factor) t.factors.get (k);
	if (f0.var < f1.var)
	  return -1;
	else if (f0.var > f1.var)
	  return 1;
	else if (f0.exp < f1.exp)
	  return 1;
	else if (f0.exp > f1.exp)
	  return -1;
      }
      if (k == factors.size ())
	return 0;
      return -1;
    }

    /** The canonical printed representation of THIS. */
    public String toString () {
      StringBuffer result = new StringBuffer ();
      if (factors.size () == 0)
	result.append (coef);
      else if (coef == -1)
	result.append ("-");
      else if (coef < -1 || coef > 1)
	result.append (coef);
      for (int i = 0; i < factors.size (); i += 1)
	result.append (factors.get (i).toString ());
      return result.toString ();
    }

  }

}
