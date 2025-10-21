npm run build
mv dist webstatic
scp -P 38822 -r webstatic blockmax@103.238.187.3:/etc/nginx
rm -r webstatic