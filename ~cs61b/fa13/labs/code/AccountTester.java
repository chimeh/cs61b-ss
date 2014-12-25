public class AccountTester {

    public static void main (String [ ] args) {
        Account mike;
        mike = new Account (1000);
        System.out.println (mike.balance ());
        mike.deposit (100);
        System.out.println (mike.balance ());
        mike.withdraw (200);
        System.out.println (mike.balance ());
    }
}
