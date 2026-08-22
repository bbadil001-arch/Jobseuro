# Jobseuro Clean-URL Migration

The source now uses extensionless internal URLs such as `/en/index`, `/en/articles`, and `/en/articles/remote-jobs-europe-no-experience` while retaining the physical `.html` files for the static deployment.

The valid `vercel.json` uses `cleanUrls: true`, so Vercel can serve the physical HTML files through extensionless URLs. Deploy the new source before changing the live canonical URL set. After deployment, test representative extensionless URLs and confirm that old `.html` URLs redirect or resolve according to the host’s clean-URL behavior.

The migration updates relative links, same-site canonical URLs, hreflang URLs, Open Graph URLs, article-index links, the support-widget path map, and the XML sitemap. External reference URLs are intentionally unchanged.

SEO precautions:

- Submit the updated sitemap after deployment.
- Keep the old URLs available through permanent redirects or the host’s documented clean-URL redirect behavior.
- Check Search Console for redirect errors, duplicate canonicals, and indexing changes during the first two to four weeks.
- Do not change the domain, language folders, or article slugs in the same release.
- If a non-Vercel host is used, configure equivalent rewrites from extensionless URLs to the physical `.html` files and permanent redirects from old `.html` URLs.
