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
### Available routes
- GET `/api`
- POST `/api`
- GET `/api/{id}`
- POST `/auth/signin`
- POST `/auth/signup`
- POST `/auth/verify`
- ALL `/brew-coffee`
- GET `/mail`
- POST `/mail`
- GET `/resume`
- GET `/status`

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
