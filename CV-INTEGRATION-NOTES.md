# Nishant Tiwari Portfolio — Integration notes

This package updates `preview/` only. `reference/` retains the imported original source unmodified.

## Included

- All owner identity, contact details, metadata, and hero canvas lettering
- Existing six-node WebGL journey now organized as *practice chapters*, not invented career dates
- Existing twelve-card WebGL gallery retains geometry and motion; its abstract thumbnails are labeled as discipline/placeholders, not verified client projects
- Added one minimal editorial `#profile` chapter containing the CV profile, Sumirayan Design Pvt. Ltd. (Present), all 19 skills, three education entries, all nine certifications/training entries, seven work disciplines, nine activities, and English/Hindi
- Functional email and phone contact; removed fake social URLs

## Missing media (not supplied)

- Nishant's walking hero clip (and tracking/alpha pipeline output)
- Nishant's cutout/portrait for timeline, gallery, and finale
- Verified portfolio films, project posters, titles, credit lists, and links

The original placeholder assets are retained for layout continuity. The original hero footage copied with the source package is **not verified as Nishant**, so it should not be published as his footage. Replace `preview/public/media/hero.*` and regenerate `manifest.json` before making the site public. The project includes `preview/tools/build_media.py` and documentation of the original alpha pipeline.

## Run

Open a terminal in `storylab-portfolio/preview` and run:

```powershell
python tools/serve.py 8000
```

Visit http://localhost:8000. If port 8000 is busy, stop the other server first or choose port 8001.

No Node build, lint, or type-check script is defined in this static project. Basic syntax, server and path checks can be performed directly.
