class ModNCounter extends Counter {

    private int myN;

    public ModNCounter (int n) {
        myN = n;
    }
    
    public int value ( ) {
        return myCount % myN;
    }
    
    public static void main (String [ ] args) {
    	// count in binary (useful preparation for CS 61C)
        ModNCounter c = new ModNCounter (2);
        System.out.println (c.value ( ));
        c.increment ( );
        System.out.println (c.value ( ));
        c.increment ( );
        System.out.println (c.value ( ));
        c.reset ( );
        System.out.println (c.value ( ));
        c.increment ( );
        System.out.println (c.value ( ));
        c.increment ( );
        System.out.println (c.value ( ));
    }
}
