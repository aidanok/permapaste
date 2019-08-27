
## PermaPaste 

Store plain text ascii documents, markdown documents on the Arweave Permaweb. Store pastes publicy or encrypted, using a password or secret link to encrypt the page. 

You do not need your private wallet key to open previously encrypted pastes, only the tx id (url) and passphrase.

The current version is deployed at: https://arweave.net/pb97TBGU6PMz--4OYWNr_ZzlHotyCvbqWvZl5b9LORc

Other features

- Permaweb App so the version you use now will always be available. 
- Lightweight & Mobile friendly
- Supports GitHub flavour Markdown (v0.29) 
- Recover and edit previous pastes by searching by wallet address or block number
- Use as mobile app (PWA), pick the Add to Home screen option from your mobile browser (tested in Mobile Firefox & Mobile Chrome)

## Use cases 

- Publish public pastes & documents
- Private notepad
- Private sharing of pastes & documents  
- Publish ascii art, e-zines or other ascii based content on the Arweave blockchain


## Potential Future Features & Improvments

- Some form of bookmarking password protected documents to allow them to be looked up easier 
- Publish Mode, publish previously saved documents.
  - Render to HTML and publish as stand-alone web page
  - Potentially publish to other arweave apps such as Scribe, Weavez, AskWeave etc. This wouldnt require any integration on       their side but would need additional tags/metadata etc added depending on the app.
- Improve editor to insert markdown snippets for tables etc.
- Add support for more markdown extensions such as charts, uml diagrams, etc.
- More content types supported 
- Password strength checking, heuristic and against haveibeenpwned database.
- File attachments
- Re-introduce hightlight.js and support code snippets more explicitly
- Insert file into editor. Insert text file as editor content, auto select format
- Use a wasm module for scrypt to decrease encrypt/decrypt time.


## Privacy

Documents are encrypted with AES256-GCM, with the key being created from a user supplied password or a randomly
generated 224bit value that is passed in the URL. 

The password or key is passed through a KDF (key derivation function, or key stretching function) with a unique salt to make brute force attacks impractical. The KDF used is `PBKDF2(scrypt(PASSWORD))` with R=2^16, P=2 for scrypt and 250,000 iterations of PBKDF2. 

The KDF and parameters were selected with influence from https://keybase.io/warp/ & https://blog.filippo.io/the-scrypt-parameters/ and considering mobile clients. 

**All encryption and decryption is done client side in the browser** Your password or content never leaves your machine and only encrypted data is transmitted over the network to be stored or retrieved by the Arweave blockchain

**IMPORTANT**: This makes brute-forcing passwords difficult, but trivial passwords like 12345 or common phrases could still be cracked easily, so **make sure to use a strong & unique password**

For scrypt we select the [scrypt-async](https://github.com/dchest/scrypt-async-js) npm library, due it having zero dependencies, being quite widely used, and documented clearly for browser use.

## Reproducible build 

To ensure the deployed verion is actually the same version as in this repo, the build is reproducible, see [REPRODUCIBLE.md](REPRODUCIBLE.md)


## Development

Built with Vue & Parcel Bundler

To run dev-mode with live-reload: 

`npm run dev` 

or 

`npm run dev-lan` to run with https so usable from lan clients. This breaks firefox live-reload.

To build for production:

`npm run build`

