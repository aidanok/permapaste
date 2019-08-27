## Reproducible Build 

Since this App could be storing sensitive information & password, there are steps to reproduce the build and verify the
deployed version matches this GitHub repoistory. Intructions for Debian Linux: 

```bash 
git clone https://github.com/aokisok/permapaste.git`
cd permapaste && npm i && npm run build 
```

This will output `dist/packaged.html`

You can compare the SHA256 checksum of that file with the deployed HTML: 

```bash
wget http://arweave.net/thedeployedtxid` 
sha256sum thedownloadedfile
sha256sum dist/packaged.html
```

This is only tested on debian linux so far, but the build should reproduce on any platform. All dependencies in package.json are pinned to exact versions.

