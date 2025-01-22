# Way to run the app

- Build docker image: `docker build -t news:dev .`
- Cammand to check image : `docker images`
- docker run: `docker run --env-file .env -p 5173:5173 news:dev`
- place .env file at package level