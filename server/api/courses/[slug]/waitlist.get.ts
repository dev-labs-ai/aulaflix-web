// Whether the signed-in student is on the course's waitlist, for the course page to show the joined state.
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const user = getSessionUser(event)
  return { joined: Boolean(user && isOnWaitlist(event, user.email, slug)) }
})
