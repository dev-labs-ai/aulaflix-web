// Former Server Action `signOut`; the page then goes to "/" (app/utils/auth-actions.ts).
export default defineEventHandler((event) => {
  endSession(event)
  return null
})
