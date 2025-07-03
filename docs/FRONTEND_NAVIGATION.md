# How Frontend Navigation Works After Authentication

In this project, Django serves only as an API backend. The frontend (HTML, CSS, JS) is served as static files by nginx (in production) or a simple HTTP server (in development). The navigation between pages after authentication is handled entirely by the frontend JavaScript.

## Key Points

- **Django** does not control which HTML page is shown after login. It only provides API endpoints for authentication and user data.
- **nginx** (or your dev HTTP server) serves static HTML files. It does not know about authentication state.
- **Frontend JavaScript** is responsible for:
  - Storing the authentication token (usually in localStorage)
  - Redirecting the user to the correct page after login
  - Protecting pages (e.g., redirecting to `login.html` if not authenticated)

## Example: Redirect After Login

In `login.html`, after a successful login, the JavaScript does:

```js
if (success) {
    // ...
    window.location.href = 'profile.html';
}
```

## Example: Protecting a Page

In `profile.html`, at the top of the script:

```js
if (!isLoggedIn()) {
    window.location.href = 'login.html';
}
```

## Summary Table

| Who decides what page to show? | How? |
|-------------------------------|------|
| Django                        | Only serves API responses, not HTML navigation |
| nginx / HTTP server           | Only serves static files, no logic |
| Frontend JS                   | Handles all redirects and navigation after login |

## How to Change the Redirect Page

- To change which page is shown after login, update the redirect in your frontend JavaScript (e.g., in `login.html`).
- To protect a page, check authentication in JS and redirect if needed.

## Why This Approach?

- **Separation of concerns**: Backend is API-only, frontend is static and fast.
- **No server-side rendering**: All navigation is client-side.
- **Easy to deploy**: Works with any static file server and API backend.

---

**In summary:**
- Django = API only
- nginx = static file server
- Frontend JS = controls navigation and page access after authentication
