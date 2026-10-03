# Server Actions become API routes with a full data refresh

In the reference app, Next re-renders the route after a Server Action sets cookies, and that is how the header and pages pick up the change. Here, each Server Action becomes a Nitro API route called with `$fetch`, followed by `refreshNuxtData()`, which re-fetches every `useFetch`/`useAsyncData` on the page. This reproduces Next's behaviour with the least room for surprises when comparing the two apps.

## Considered options

- **Native form posts that answer with a redirect**, to keep the forms that work without JavaScript in the reference app. Rejected: working without JavaScript is neither documented nor tested there, and it would mean two code paths per form.
- **Each route returns the new state and components update locally.** Rejected: more code, and a stale header becomes likely.

## Consequences

Sign out, email confirmation, joining and leaving the waitlist ("Avise-me" and the email form) and marking a lesson as done work without JavaScript in the reference app. Here they need it.
