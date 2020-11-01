# API Console docker image

This project contains the docker image for the API Console.

It can be used to run API Console as a stand-alone application on a www server with an API specification passed as a variable.

## Usage

```sh
docker run  \
  -v "$PWD":/app/api
  -e API_PROJECT="api.raml" \
  -e API_TYPE="RAML 1.0" \
  -e API_MIME="application/raml" \
  gcr.io/api-console-a6952/app:0.1.0
```

Note the version after the image. Use the latest version of the image.

This command assumes that you are running it in your API definition folder.

- `API_PROJECT` is the name of the API main file. This variable is required.
- `API_TYPE` is one of supported by the API Console API types. Currently it is `RAML 1.0`, `RAML 0.8`, `OAS 2.0`, `OAS 3.0`. This variable is required.
- `API_MIME` media type of the API. RAML projects has only `application/raml` mime type. OAS can be `application/yaml` or `application/json`. This variable is optional and the process will try to guess the right mime type. Set it if the initialization script throws errors.

Note, support for OAS 3.0 is experimental in API Console and may not work properly. Feel free to report an issue if you notice problems rendering OAS 3.0 API documentation.

`API_PROJECT` can reference a remote file that is publicly visible in current network. In this case don't use `-v "$PWD":/app/api` option.

### Application port

By default the application runs on port `8080`. You can change this behavior by setting `PORT` environment variable.

### Deploying to Kubernetes

Below is an example deployment configuration for your container.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apiconsole-frontend
  labels:
    app: apiconsole-www
spec:
  selector:
    matchLabels:
      app: apiconsole
      tier: frontend
  replicas: 3
  template:
    metadata:
      labels:
        app: apiconsole
        tier: frontend
    spec:
      containers:
      - name: apiconsole-www
        image: gcr.io/api-console-a6952/app:0.1.0
        env:
        - name: API_PROJECT
          value: https://domain.com/api.raml
        - name: API_TYPE
          value: "RAML 1.0"
        - name: API_MIME
          value: "application/raml"
```

This example assumes the API is available publicly over internet. You can use `volumes` property in the deployment configuration.
See [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/) documentation
for more details.
