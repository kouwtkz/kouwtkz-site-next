cd ..\..\kouwtkz-site-next
node -r dotenv/config ./mediaScripts/LiteBuild.mjs
wrangler pages deploy out/html --project-name kouwtkz --commit-dirty true --branch master
@REM pause
