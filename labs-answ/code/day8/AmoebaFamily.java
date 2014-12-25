import java.util.*;

public class AmoebaFamily {
	
	private Amoeba myRoot = null;
	
	public AmoebaFamily (String name) {
		myRoot = new Amoeba (name, null);
	}
	
	/** Add a new amoeba named CHILDNAME as the youngest child
	 * of the amoeba named PARENTNAME. Precondition: the amoeba family 
	 * contains an amoeba named PARENTNAME. */
	public void addChild (String parentName, String childName) {
		// You supply this code.
	}
	
	/** Print the names of all amoebas in the family. Names appear in 
	 *  preorder, with children's names printed oldest first. Members of 
	 *  the family constructed with the main program below would be
	 *  printed in the following sequence:
	 *		Amos McCoy, mom/dad, me, Mike, Bart, Lisa, Homer, Marge,
	 *		Bill, Hilary, Fred, Wilma */
	public void print ( ) {
		// You supply this code.
	}
	
	/** A preorder iterator yielding all Amoebas in THIS. */
	public Iterator<String> allAmoebas ( ) {
		return new AmoebaIterator ( );
	}
	
	public static void main (String [ ] args) {
		AmoebaFamily family = new AmoebaFamily ("Amos McCoy");
		family.addChild ("Amos McCoy", "auntie");
		family.addChild ("Amos McCoy", "mom/dad");
		family.addChild ("mom/dad", "me");
		family.addChild ("mom/dad", "Fred");
		family.addChild ("mom/dad", "Wilma");
		family.addChild ("me", "Mike");
		family.addChild ("me", "Homer");
		family.addChild ("me", "Marge");
		family.addChild ("Mike", "Bart");
		family.addChild ("Mike", "Lisa");
		family.addChild ("Marge", "Bill");
		family.addChild ("Marge", "Hilary");
		System.out.println ("Here's the family:");
		family.print ( );
		/*
		  System.out.println ("");
		  System.out.println ("Here it is again!");
		  Iterator<String> iter = family.allAmoebas ( );
		  while (iter.hasNext ( )) {
		  System.out.println (iter.next ( ));
		  }
		*/
	}
	
	public class AmoebaIterator implements Iterator<String> {
		/** Names of amoebas in the family are enumerated in preorder,
		 *  with children enumerated oldest first.
		 *  Members of the family constructed with the main program above
		 *  will be enumerated in the following sequence:
		 *	   Amos McCoy, auntie, mom/dad, me, Mike, Bart, Lisa, Homer, 
		 *	   Marge, Bill, Hilary, Fred, Wilma
		 *  Complete enumeration of a family of N amoebas should take
		 *  O(N) operations. */

		public String next () {
			return null; // You will supply this code
		}

		public boolean hasNext () {
			return false; // You will supply this code
		}

		public void remove () {
			throw new UnsupportedOperationException ();  // We won't do this.
		}
		
	} 

	private class Amoeba {

		String myName;		
		Amoeba myParent;		
		ArrayList<Amoeba> myChildren;
		
		public Amoeba (String name, Amoeba parent) {
			myName = name;
			myParent = parent;
			myChildren = new ArrayList<Amoeba> ( );
		}
		
		public String toString ( ) {
			return myName;
		}
		
		public Amoeba parent ( ) {
			return myParent;
		}
		
		/** Add an amoeba named CHILDNAME as this amoeba's youngest child. */
		public void addChild (String childName) {
			Amoeba child = new Amoeba (childName, this);
			myChildren.add (child);
		}
	} // end of Amoeba inner class
}
