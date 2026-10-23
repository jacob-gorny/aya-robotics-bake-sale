# AYA Robotics launch — 2026-10-23

Production URL: https://jacob-gorny.github.io/aya-robotics-bake-sale/

The donation site introduces the AYA Robotics team, the $4,000 goal, $1,000 robot naming, and $4,000 team naming. All donation buttons open the school's Blackbaud form and retain the hosted form URL as their fallback. No payment was submitted during verification.

## Hero animation

`assets/hero/robot-build.mp4` is a 17.8-second, 1280×720, 30 fps H.264 video with a keyframe every six frames for seeking. The approved blueprint-to-parts opening is followed by controlled compositing of a fixed set of parts from its last frame. All nine part groups retain their pixels and shape during assembly. Movement uses eased translations with brief rests between stages. The replacement generative assembly clips still deformed hardware and are not used in production.

Text, donation links, and the white fade are HTML/CSS. Scroll seeks the video in either direction. Pause preserves the current frame and page height. Reduced-motion and JavaScript-disabled visits show the finished robot poster and working donation links.

The animation is an illustrative composite, not a CAD model or engineering demonstration. Source for the controlled assembly is in `storyboard/controlled/`. Its input is the final frame of the approved opening. `render.mjs` uses a browser exposed on local CDP port 9223 and a local web server on port 4173, then pipes rendered frames into ffmpeg. The original approved opening is retained in `storyboard/physical-mat/blueprint-to-parts-timed-preview.mp4`.

## Verification

- Desktop 1440×900: forward/reverse seeking at eight positions, matching video time; all copy remains above the CTA.
- Mobile 390×844 and 375×667: no horizontal overflow; assembled robot, copy, and controls reviewed visually.
- Pause/resume: paused frame and story height stay unchanged; resume seeks to the current scroll position.
- Reduced motion: no video download; single-viewport story and loaded poster.
- JavaScript disabled: poster, opening copy, hosted donation fallback remain available; inactive pause control is hidden.
- Donation modal: school logo and “Go AYA Robotics!” campaign rendered successfully on mobile.
- Direct `?bbFormId=d8884b63-7173-4615-a2b9-012777d9e473` link opens the form.
- JavaScript syntax check and `git diff --check` passed.

## Custom domain — pending access to GoDaddy

The available browser receives an Access Denied response on GoDaddy's home and sign-in pages before login can begin. The connected desktop device is offline. DNS was read successfully: ayarobotics.ai currently resolves to parking addresses 15.197.148.33 and 3.33.130.190. No GoDaddy DNS or GitHub custom-domain settings have been changed.

Once the normal GoDaddy DNS editor is available, complete both sides in the same session:

1. Set the GitHub repository's Pages custom domain to `ayarobotics.ai`.
2. Replace the apex parking A records with the four GitHub Pages records below, and set the `www` CNAME. Keep unrelated mail and verification records.
3. Confirm public DNS and GitHub's domain check. Enable Enforce HTTPS once the certificate is ready.
4. Update canonical and Open Graph URLs in `index.html` to the working custom domain, push, and check both apex and `www` over HTTPS.

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | jacob-gorny.github.io |

Source: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

Do not set the custom domain while GoDaddy remains inaccessible: the existing public URL must stay usable during launch.
