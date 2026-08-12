import { authSlice, setUser, clearUser } from "@/store/slices/authSlice";

const reducer = authSlice.reducer;

const mockUser = { id: "u1", name: "Alice", email: "alice@example.com" };

describe("authSlice — initial state", () => {
  it("has null user and isAuthenticated false", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe("setUser", () => {
  it("stores the user payload", () => {
    const state = reducer(undefined, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
  });

  it("sets isAuthenticated to true", () => {
    const state = reducer(undefined, setUser(mockUser));
    expect(state.isAuthenticated).toBe(true);
  });

  it("replaces an existing user with a new one", () => {
    const firstState = reducer(undefined, setUser(mockUser));
    const newUser = { id: "u2", name: "Bob", email: "bob@example.com" };
    const secondState = reducer(firstState, setUser(newUser));
    expect(secondState.user).toEqual(newUser);
    expect(secondState.isAuthenticated).toBe(true);
  });
});

describe("clearUser", () => {
  it("resets user to null", () => {
    const loggedIn = reducer(undefined, setUser(mockUser));
    const state = reducer(loggedIn, clearUser());
    expect(state.user).toBeNull();
  });

  it("sets isAuthenticated to false", () => {
    const loggedIn = reducer(undefined, setUser(mockUser));
    const state = reducer(loggedIn, clearUser());
    expect(state.isAuthenticated).toBe(false);
  });

  it("is a no-op on an already-cleared state", () => {
    const state = reducer(undefined, clearUser());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
