# Quick Fix Reference

## Problems Fixed

### Problem 1: SWC Dependency Error
```
Failed to patch lockfile, please try uninstalling and reinstalling next in this workspace
```
**Fix**: Deleted corrupted lockfiles and ran `yarn install`

---

### Problem 2: Image 404 Errors
```
GET /media/product_images/*.jpg 404
⨯ The requested resource isn't a valid image for /media/product_images/... received null
```

**Fix**: Created `getImageUrl()` helper function that:
- Handles absolute URLs (from API) ✅
- Handles relative paths ✅
- Provides fallback for missing images ✅
- Prepends API base URL automatically ✅

---

## Changes Made

| File | Change |
|------|--------|
| `lib/utils.ts` | Added `getImageUrl()` function |
| `components/product-card.tsx` | Updated image src to use `getImageUrl()` |
| `components/product/product-gallery.tsx` | Updated main & thumbnail images |
| `components/bento-product-card.tsx` | Updated image src to use `getImageUrl()` |
| `components/home/hero-section.tsx` | Updated hero image path |

---

## Result

✅ No more lockfile errors  
✅ All images load correctly from backend  
✅ Proper error handling with fallbacks  
✅ Clean dev server startup  
✅ No console errors  

**Server ready at http://localhost:3001** 🚀
