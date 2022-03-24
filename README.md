# Axios Verror

Enhance Axios request errors using VError.


## Installation

```bash
npm install @centrapay/axios-verror
```


## Usage

Handle axios errors with `AxiosVError.enhance`:

```javascript
axios.request(args).catch(AxiosVError.enhance);
```

Error will be rethrown as a VError with a better error message and
with `VError.info()` populated with structured details about the
error.


## Complete Example

```javascript
const AxiosVError = require('@centrapay/axios-verror');
const axios = require('axios');

async function callApi(data) {
await axios.request({
  url: 'http://myhost/',
  method: 'POST',
  data,
}).catch(AxiosVError.enhance);
```

## Handling Enhanced Errors

```javascript
try {
  await callApi({ msg: 'hello' });
}
catch (e) {
  if (VError.info(e).axios?.status == 421) {
    // handle rate limit
  }
}
```


## Error Messages

Axios error messages normally only provide an HTTP status code. This,
presumably, prevents Axios leaking potentially sensitive details into logs,
such as host names or path parameters, but it makes debugging errors difficult.
Example Axios error message:

```
Request failed with status code 400
```

Enhanced error messages include status, method, URL and a formatted
message extracted from the response. Example enhanced message:

```
[400] POST https://host/ (invalid request): Request failed with status code 400
```




## History

See [Changelog](./CHANGELOG.md)

## Legal

Copyright © 2022 [Centrapay][].

This software is licensed under Apache-2.0 License. Please see [LICENSE](/LICENSE) for details.


[Centrapay]: https://centrapay.com/
