# libvf

Javascript wrapper for the Verified API, for use in the browser.

## Links
* [The official Verified API documentation](https://docs.verified.eu)
* [Find this package on NPM](https://npmjs.com/package/libvf)
* [CDN for this package](https://unpkg.com/libvf)

## Getting started

### Installation
ES6 imports
```javascript
import * as libvf from 'libvf'

// Or specify which modules to import

import { auth, envelopes, companies, oidc } from 'libvf'
```

From CDN
<br>
<small>creates a global object `libvf`</small>
```html
<script src="https://unpkg.com/libvf"></script>
```


### Authentication
Using your Verified credentials<br>
<small>Namespace is optional, but you will not be able to act on behalf of a company without it.</small>
```javascript
const jwt = await libvf.auth.login({
  email: 'john.doe@example.com',
  password: '***********',
  namespace: '/companies/your_company_id'
})
```

Using an existing JWT
```javascript
libvf.auth.setToken('JWT ey...')
libvf.auth.setNamespace('/companies/your_company_id')
```


Getting the JWT and namespace from the URL parameters<br>
<small>Looks for the url parameters `verified_token` or `access_token` for the jwt, and `c` or `namespace` for the namespace. If not found, an error will be thrown.</small>
```javascript
libvf.auth.useTokenFromUrl()
```

### Creating an envelope
Requires a descriptor id as argument, in most cases this will be `default`.
```javascript
let envelope = await libvf.envelopes.create('default')
```

### Fetching the envelope data
With the steps above completed, we now have an envelope object which references the envelope stored in the API. In order to get the data stored in the API into our local object, we need to reflect any recent changes.
```javascript
await envelope.reflect()
```
This makes a request to the API, reads all of the envelope data, parses it and creates local instances of any documents, recipients, templates etc in our local object.


### Uploading files
Uploading the main pdf to a document
```javascript
await envelope.firstDocument().uploadPDF('Story of the padded one.pdf', fileBinary)
```

Uploading an attachment to a document
```javascript
await envelope.firstDocument().uploadAttachment('Story of the deploy man.txt', fileBinary)
```

### Adding recipients
```javascript
await envelope.addRecipient({
  givenName: "John",
  familyName: "Doe",
  language: "en_EN",
  signingMethod: "email",
  email: "john.doe@example.com",
  order: 1,
  role: {
    action: "sign",
    label: "Signatory",
    name: "signer"
  }
})
```

### Publishing the envelope
```javascript
await envelope.publish()
```