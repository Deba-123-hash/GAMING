# 3D Models Directory (`public/models/`)

Store only validated, web-optimized **GLB** (preferred) or **glTF** assets here. Never commit raw `.blend` or `.fbx` files inside `public/`.

- **Accepted Formats:** `.glb`, `.gltf` (with Draco or Meshopt geometry compression)
- **Naming Convention:** Lowercase kebab-case (`<role>-<name>-v<n>.glb`, e.g., `striker-kai-vance-v1.glb`, `stadium-apex-bowl-v1.glb`)
- **Optimization:** Run `node scripts/optimize-models.mjs <raw.glb> <out.glb>` before committing
- **Licensing:** Original fictional assets or commercially verified CC0 / Standard licenses only. Log every external file in `docs/3D_ASSET_LICENSE_REGISTER.md` and `src/data/assetRegistry.js`.
- **Current Status:** Awaiting production 3D models. React Three Fiber components render safe procedural stand-ins until real `.glb` assets are added.

