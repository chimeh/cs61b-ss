/** Functions to sum and increment the elements of a WeirdList. */
class User {
    /** Returns the result of adding N to each element of L. */
    static WeirdList add(WeirdList L, int n) {
       return L.map((x)->{return n + x;});
/*        return L.map(new IntUnaryFunction() {
            @Override
            public int apply(int x) {
                return n + x;
            }
        });*/
    }

    /** Returns the sum of the elements in L */
    static int sum(WeirdList L) {
        User.sum sumf = new User.sum();
        L.map(sumf);
        return sumf.getSum();
    }

    // FILL IN OTHER CLASSES USED BY HERE (HINT, HINT).
    // You MAY want to add some private nested classes (and methods) to
    // be used by User (start them off with 'private static class...'),
    // OR you may want to add more class files to those provided in the
    // skeleton.  In the latter case, be sure you 'svn add' them as well.
    private static class sum implements IntUnaryFunction {
            private int sum = 0;
            public int getSum() {
                return sum;
            }
            @Override
            public int apply(int x) {
                sum += x;
                return x;
            }
    }
}

