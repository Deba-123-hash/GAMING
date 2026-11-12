# RIVALRY 90 — Media & Image Provider Integration

- **Primary Configured Storage:** Reuses `SUPABASE_STORAGE_BUCKET` (`rivalry90-public-assets` default) and avatar validation (`JPEG`, `PNG`, `WebP` `<= 2 MB`) in [api/profile/avatar/route.js](file:///D:/GAMING/src/app/api/profile/avatar/route.js).
- **Optional Cloudinary Support:** `.env.example` documents `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` if external image CDN transformations are activated later.
- **Asset Licensing Policy:** Binary media files are never stored in PostgreSQL; all showcase assets track creator, source URL, license type, and `commercial_use_allowed` in `media_attributions` (`database/schema/03_content_and_media.sql`).

