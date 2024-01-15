
// A simple class that returns a different integer each time.
// It's used by accounts to give them a unique id, useful when iterating through accounts
export default class IdProvider {
    private static currentId = 0;

    static getId() {
        return ++this.currentId;
    }
}
