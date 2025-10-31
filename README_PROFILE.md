Profile image: how to crop & add your photo

I added code to use `assets/profile.jpg` and `assets/profile@2x.jpg` as the header avatar.

To generate optimized, cropped images from your original photo, a small helper script exists at `scripts/process_profile.py`.

Notes about what I did for you in the project:
- I placed the image you uploaded into `assets/profile.jpg` and created a copy `assets/profile@2x.jpg` for retina support. The site is already wired to use these files via `srcset`.
- I added a subtle hero overlay and avatar styling so the profile photo reads well against the page background without requiring immediate image editing.

If you want more precise cropping/retouching (auto-contrast, sharpening, background removal), you can either:

1) Run the included script locally (PowerShell):

```powershell
# install Pillow if needed
python -m pip install --user pillow

# run the crop/adjust script (replace path to your file)
python .\scripts\process_profile.py "C:\Users\<you>\Downloads\your-photo.jpg"
```

2) Or upload the full-resolution photo here and I can process and add the optimized files into the project for you.

If you don't want any more image edits, you're all set — open `index.html` and preview the site. If you'd like help running the script or want me to process the image here, tell me and I'll proceed.
