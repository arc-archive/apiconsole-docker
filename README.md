> ## 🛠 Status: In Development
> This project is in active development. No image has been released just yet.


# API Console docker image

This project contains docker image for API Console.

It can be used to run API Console as a stand-alone application on a www server
with an API specification passed as a variable.

## Usage

```bash
docker run  \
  -v "$PWD":/app/api
  -e API_PROJECT="api.raml" \
  -e API_TYPE="RAML 1.0" \
  -e API_MIME="application/raml" \
  -e GA_ID="UA-XXXXXXXX-YY" \
  gcr.io/api-console-a6952/standalone-app
```

This command assumes that you are running it in your API definition folder.

-   `API_PROJECT` is the name of the API main file. This variable is required.
-   `API_TYPE` is one of supported by the API Console API types. Currently it is `RAML 1.0`, `RAML 0.8`, `OAS 2.0`, `OAS 3.0`. This variable is required.
-   `API_MIME` media type of the API. RAML projects has only `application/raml` mime type. OAS can be `application/yaml` or `application/json`. This variable is optional and the process will try to guess the right mime type. Set it if the initialization script throws errors.
-   `GA_ID` optional Google Analytics ID.

Note, support for OAS 3.0 is experimental in API Console and may not work properly. Feel free to report an issue if you notice problems rendering OAS 3.0 API documentation.

`API_PROJECT` can reference a remote file that is publicly visible in current network. In this case don't use `-v "$PWD":/app/api` option.
