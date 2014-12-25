/** java HW1Test should test the methods defined in Progs.
 *  @author
 */
public class HW1Test {

    /** Run all tests. */
    public static void main(String[] args) {
        report("factorSum", testFactorSum());
        report("printSociablePairs", testPrintSociablePairs());
        report("dcatenate", testDcatenate());
        report("sublist", testSublist());
        report("dsublist", testDsublist());
    }

    /** Print message that test NAME has (if ISOK) or else has not
     *  passed. */
    private static void report(String name, boolean isOK) {
        if (isOK) {
            System.out.printf("%s OK.%n", name);
        } else {
            System.out.printf("%s FAILS.%n", name);
        }
    }

    // Replace the bodies of the functions below with something serious.

    /** Return true iff factorSum passes its tests. */
    private static boolean testFactorSum() {
        if(Progs.factorSum(2) != 1 
            || Progs.factorSum(20) != 22
            || Progs.factorSum(51) != 21) {
            return false;
        }
        return true;
    }

    /** Return true iff printSociablePairs passes its tests. */
    private static boolean testPrintSociablePairs() {
        Progs.printSociablePairs(7000);
        return true;
    }

    /** Return true iff dcantenate passes its tests. */
    private static boolean testDcatenate() {
        IntList L0  = IntList.list();
        IntList La  = IntList.list(1, 2, 3, 4);
        IntList Lb  = IntList.list(5, 6, 7);
        IntList Lc  = IntList.list(1, 2, 3, 4, 5, 6, 7);
        IntList Ld  = IntList.list(5, 6, 7, 1, 2, 3, 4);
        
        if(!Progs.dcatenate(L0, La).equals(La)) {
            return false;
        }
        if(!Progs.dcatenate(La, L0).equals(La)) {
            return false;
        }
        if(!Progs.dcatenate(La, Lb).equals(Lc)) {
            return false;
        }
        // this point  La is change, have refer Lb, dcatenate again cause loop
        //System.out.println(Progs.dcatenate(Lb, La).toString());
        //if(!Progs.dcatenate(Lb, La).equals(Ld)) {
        //    return false;
        //}
        return true;
    }

    /** Return true iff sublist passes its tests. */
    private static boolean testSublist() {
        IntList Lorig  = IntList.list(1, 2, 3, 4, 5, 6, 7);
        IntList L0  = null;
        IntList L1  = IntList.list(1, 2, 3, 4);
        IntList L2  = IntList.list(5, 6, 7);
        if(!(Progs.sublist(Lorig, 0, 0) == null)){
            return false;
        }
        if(!(Progs.sublist(Lorig, 1, 0) == null)){
            return false;
        }
        if(!Progs.sublist(Lorig, 0, 4).equals(L1)){
            return false;
        }
        if(!Progs.sublist(Lorig, 4, 3).equals(L2)){
            return false;
        }
        if(!Progs.sublist(Lorig, 0, 7).equals(Lorig)){
            return false;
        }
        return true;
    }

    /** Return true iff dsublist passes its tests. */
    private static boolean testDsublist() {
        return false;
    }

}
