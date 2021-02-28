# api
[![adriancleung-api version][version-image]][version-url]

Backend code for my website and services

## Development
This is a [Node.js][node-url] module available through cloning of this repository. The recommended
development environment for this project is using dev containers.

This project uses the following:
- Express
- Gmail API
- YouTube Data API v3
- Firebase

An OAuth 2.0 Client ID with **Application Type** as `Desktop app` must be generate to access the Gmail API and YouTube Data API v3. An OAuth consent screen must be created with the following scopes:
 - `https://www.googleapis.com/auth/gmail.send`
 - `https://www.googleapis.com/auth/youtube.force-ssl`
 
You can retrieve your Firebase service account key from **Firebase** > **Project settings** > **Service accounts** > **Firebase Admin SDK** > **Generate new private key**

Clone this repository:

```sh
git clone https://git.adrianleung.dev/api
```

### Dev Container Development
Create a copy of `.env.TEMPLATE` as `.env` and replace the values with the proper values.
### Local Development
Grab the environment variables from `.env.TEMPLATE` and replace the values before adding to your environment.

## API
### Definitions
All available routes are defined using [OpenAPI Specification (OAS) 3.0.3][openapi-spec]. OAS is a standard, language-agnostic interface that defines RESTful APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network inspection.

The definitions can be accessed at [`api.adrianleung.dev/v[major]`][api-v1] where `major` is the major release number of the API server. The current definitions can be found [here][api-v1]. All definitions uses and conforms to the OpenAPI Specification.

### Documentation
This project uses [swagger-jsdoc] and [swagger-ui-express] to generate the OpenAPI Specification document containing the definitions. If developing with dev containers, the [Swagger Editor][swagger-editor] is provided for visual aid when creating JSDoc definitions. JSDoc definitions are created in the `index.js` file for each route to keep `route.js` clutter free. Common auth, schema, and response components are defined in [`docs/openapi.yaml`](https://git.adrianleung.dev/api/blob/master/docs/openapi.yaml). Documentation on how to create definitions and components can be found [here][openapi-spec].

## Tasks
Tasks can run at specific times based on [GNU crontab][crontab-url]

### Allowed fields

```
  ┌────────────── second (optional)
  │ ┌──────────── minute
  │ │ ┌────────── hour
  │ │ │ ┌──────── day of month
  │ │ │ │ ┌────── month
  │ │ │ │ │ ┌──── day of week
  │ │ │ │ │ │
  │ │ │ │ │ │
  * * * * * *
```

### Allowed values

|     field    |        value        |
|--------------|---------------------|
|    second    |         0-59        |
|    minute    |         0-59        |
|     hour     |         0-23        |
| day of month |         1-31        |
|     month    |     1-12 (or names) |
|  day of week |     0-7 (or names, 0 or 7 are sunday)  |

### Specifying tasks
To add a task, follow `tasks.yaml.TEMPLATE`. Give the task a name under `tasks` and point `module` to where the task is created. `schedule` specifies when to run the task based on the crontab syntax.

[version-image]: https://img.shields.io/github/package-json/v/adriancleung/api/master?label=adriancleung-api
[version-url]: https://api.adrianleung.dev
[node-url]: https://nodejs.org/en/
[crontab-url]: ttps://www.gnu.org/software/mcron/manual/html_node/Crontab-file.html
[openapi-spec]: https://swagger.io/specification
[api-v1]: https://api.adrianleung.dev/v1
[swagger-jsdoc]: https://www.npmjs.com/package/swagger-jsdoc
[swagger-ui-express]: https://www.npmjs.com/package/swagger-ui-express
[swagger-editor]: https://swagger.io/tools/swagger-editor/
