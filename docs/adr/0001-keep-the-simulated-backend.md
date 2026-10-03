# Keep the simulated backend, weaknesses included

The reference app simulates sign-in, purchases, lesson progress and the waitlist in httpOnly cookies. The port keeps the same cookie names and formats on purpose, including the unsigned session cookie (it holds only the email, so anyone can forge it) and the unsalted SHA-256 password hash. A real backend is a separate project. Fixing part of the prototype's security would suggest it is safe when it is not, and changing behaviour would cost us the reference app as the yardstick for parity. Don't "fix" these during the port.

## Consequences

- e2e tests sign in by setting the session cookie, so signed-in routes don't depend on the sign-in page being ported first.
- On `localhost`, cookies are shared across ports, so a session opened in one app is valid in the other when comparing them side by side.
