// ===========================================================================
// DELETE THIS FILE. IT EXISTS ONLY TO FAIL.
//
// This is a deliberate type error, pushed to check that branch protection on
// `main` actually BLOCKS a merge rather than merely reporting a red run. The
// Checks workflow has caught real defects several times, but a workflow that
// reports and a workflow that gates are different things, and the difference
// is a repository setting nobody had verified.
//
// WHAT TO EXPECT ON THE PULL REQUEST:
//
//   mergeable_state: "blocked"   protection is on and `checks` is required.
//                                The control works. Close this PR.
//   mergeable_state: "unstable"  the check failed and the PR is STILL
//                                mergeable. Either protection is off, or the
//                                required check name does not match the check
//                                run name, which is `checks` — lowercase, the
//                                job id, not the workflow title `Checks`.
//
// Nothing imports this file, so it changes no behaviour. It fails `tsc`, which
// is the first step of the workflow and the one that caught the error that
// reached main in #530.
// ===========================================================================

/** Deliberately wrong: a string is not a number. */
export const PROBE_FAILS_TYPECHECK: number = "this is not a number";
