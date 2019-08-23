

## PermaPaste 

Store plain text ascii documents, markdown documents and code snippets on the Arweave Permaweb. Store pastes publicy or encrypted, using a password or secret link to encrypt the page. 

Other features

- Permaweb App so the version you use now will always be available. 
- Lightweight & Mobile friendly
- Supports GitHub flavour Markdown (v0.29) 
- Recover and edit previous pastes by searching by wallet address or block number

## Use cases 

- Sharing ascii text or markdown documents with people 
- Storing private key files, passwords etc on the Arweave blockchain behind strong encryption
- Edit and work on documents privately before public release
- Private journal or notepad without storing anything on your own device or cloud providers
- Publishing e-zines, ascii art or other text based content on the Arweave blockchain

## Potential Future Features 

- More content types supported 
- WSIWYG editor for Markdown or other rich text formats
- Streamline UX for the different use-cases.
- File attachments

## Privacy

Documents are encrypted with AES256-GCM, with the key being created from a user supplied password or a randomly
generated 224bit value that is passed in the URL. 

The password or key is passed through a KDF (key derivation function, or key stretching function) with a unique salt to make brute force attacks impractical. The KDF used is `PBKDF2(scrypt(PASSWORD))` with R=2^15, P=3 for scrypt and 250,000 iterations of PBKDF2
 
**All encryption and decryption is done client side in the browser** Your password or content never leaves your machine and only encrypted data is transmitted over the network to be stored or retrieved by the Arweave blockchain

**IMPORTANT**: This makes brute-forcing passwords difficult, but trivial passwords like 12345 or common phrases could still be cracked easily, so **make sure to use a strong & unique password**

For scrypt we use the scrypt-async npm library, due it having zero dependencies and being well documented.

## Development

Built with Vue & Parcel Bundler

To run dev-mode with live-reload: 

`npm run dev`

To build for production:

`npm run build`

