# Introduction
This is a wrapper API for [Star Wars API](https://swapi.dev/). It provides user authentication, and some
authorization options. 

# Installation
Copy `.env.example` to `.env` - you can change some  environmental variables, but `.env.example` contains configuration
that makes project runnable. Then run:

```bash
docker-compose up --build
```

On the first launch an initialization of MySQL takes more time than usually. This may cause an error when the
app tries to the database. If it occurs, shut down the `sw-api` service and run it again.

# Usage
Database and API ports are mapped to `.env` variables `DOCKER_DATABASE_PORT` and `DOCKER_API_PORT` 
(defaulting to 33060 and 3000)

Swagger documentation is available on `/api`.
