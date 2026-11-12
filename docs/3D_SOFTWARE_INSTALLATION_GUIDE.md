# 3D Software Installation & Setup Guide

> **Safety Note:** Desktop applications below are external tools. Do **not** install them via npm or automated scripts. Always download from official vendor pages and verify system requirements.

## Table of Contents
1. [Blender (Essential)](#1-blender-essential)
2. [Spline (Browser-Based 3D)](#2-spline-browser-based-3d)
3. [Mixamo (Character Rigging & Animation)](#3-mixamo-character-rigging--animation)
4. [Cascadeur (Physics-Assisted Animation)](#4-cascadeur-physics-assisted-animation)
5. [Adobe Substance 3D (Optional PBR Texturing)](#5-adobe-substance-3d-optional-pbr-texturing)
6. [Meshy (Optional AI Prototyping)](#6-meshy-optional-ai-prototyping)
7. [Asset Websites Setup (Poly Haven & Sketchfab)](#7-asset-websites-setup-poly-haven--sketchfab)
8. [Exporting, Validating & Optimizing GLB for RIVALRY 90](#8-exporting-validating--optimizing-glb-for-rivalry-90)

---

## 1. Blender (Essential)
- **Official Site:** https://www.blender.org/
- **Platforms:** Windows, macOS, Linux (Free & Open Source, GPL).
- **Installation:** Download the latest LTS release from `blender.org/download/` and run the official installer.
- **RIVALRY 90 Usage:** Modeling stadiums, fictional footballers, kits, pitch props, UV unwrapping, NLA clip assembly, and `.glb` export.

## 2. Spline (Browser-Based 3D)
- **Official Site:** https://spline.design/
- **Platforms:** Web Browser (plus optional desktop app for Windows/macOS/Linux).
- **Pricing:** Freemium (free tier available; paid tiers unlock extra export/team features).
- **RIVALRY 90 Usage:** Rapid UI-adjacent 3D concepting and material/lighting prototyping.

## 3. Mixamo (Character Rigging & Animation)
- **Official Site:** https://www.mixamo.com/
- **Platforms:** Web Browser (requires free Adobe account).
- **RIVALRY 90 Usage:** Auto-rigging fictional T-pose humanoid athletes and downloading locomotion/sports clips (`idle`, `walking`, `running`, `dribbling`, `shooting`, `celebration`) as FBX, then converting via Blender to `.glb`.

## 4. Cascadeur (Physics-Assisted Animation)
- **Official Site:** https://cascadeur.com/
- **Platforms:** Windows, macOS, Linux.
- **Pricing:** Freemium (free indie/basic license tier; paid Pro/Studio tiers for advanced export/team usage—verify current terms before commercial export).
- **RIVALRY 90 Usage:** Authoring realistic football kicking mechanics, center-of-mass balance, and diving goalkeeper animations.

## 5. Adobe Substance 3D (Optional PBR Texturing)
- **Official Site:** https://www.adobe.com/products/substance3d.html
- **Platforms:** Windows, macOS, Linux (Paid subscription).
- **RIVALRY 90 Usage:** Authoring high-detail kit weaves, boot leather wear, turf grime, and stadium concrete PBR maps.

## 6. Meshy (Optional AI Prototyping)
- **Official Site:** https://www.meshy.ai/
- **Platforms:** Web Browser (Freemium / Credit-based).
- **RIVALRY 90 Usage:** Early silhouette blockouts only. Check current Meshy plan restrictions and commercial ownership terms before shipping any generated asset.

## 7. Asset Websites Setup (Poly Haven & Sketchfab)
- **Poly Haven:** https://polyhaven.com/ — Download HDRIs (`.exr`/`.hdr`) and PBR textures (CC0, no account required).
- **Sketchfab:** https://sketchfab.com/ — Create account only if needed; check every model's individual license (`CC BY`, `CC0`, `Standard`, vs. `Editorial`) before downloading `.glb`.

## 8. Exporting, Validating & Optimizing GLB for RIVALRY 90

### Blender Export Checklist
1. Select target meshes + armature (`Ctrl+A` apply scale/rotation).
2. `File -> Export -> glTF 2.0 (.glb/.gltf)`.
3. Format: **glTF Binary (.glb)**.
4. Enable **+Y Up**, **Apply Modifiers**, **Tangents** (if normal-mapped), **Animation -> NLA Tracks**.

### Validate & Optimize in Terminal
```bash
# 1. Validate GLB structure
npx gltf-validator public/models/players/forwards/my-player.glb

# 2. Compress geometry (Draco) and textures (WebP)
npx gltf-transform optimize raw-player.glb public/models/players/forwards/my-player.glb --compress draco --texture-compress webp

# 3. Inspect resulting stats in browser
# Open https://gltf.report/ and drop the optimized .glb
```

### Add to RIVALRY 90
1. Place the validated `.glb` inside the matching `public/models/` subfolder.
2. Register the file in `src/data/assetRegistry.js`.
3. Log source, creator, and license in [3D_ASSET_LICENSE_REGISTER.md](./3D_ASSET_LICENSE_REGISTER.md).

---

**Related Documents:** [3D Tools Directory](./3D_TOOLS_AND_RESOURCE_DIRECTORY.md) · [License Register](./3D_ASSET_LICENSE_REGISTER.md)

