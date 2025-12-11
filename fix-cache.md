# Quick Fix for Skills Not Loading

## Option 1: Clear Browser Storage (Fastest)
1. Open browser console (F12)
2. Run this command:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Option 2: Hard Reload
- Chrome/Edge: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Firefox: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)

## Option 3: Incognito/Private Window
- Test in incognito mode to bypass cache entirely

## If Issue Persists:
The problem is a React state synchronization bug. Skills load but don't render until DevTools triggers a re-render.
