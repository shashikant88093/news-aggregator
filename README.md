# create .env file and place the url and api there

- News Urls
` VITE_NEWS_API=https://newsapi.org/v2
VITE_GUARDIANAPI=https://content.guardianapis.com
VITE_NEWS_API_DATA=https://newsdata.io/api/1 `

- News Api Key
`VITE_NEWS_API_KEY=
VITE_GUARDIANAPI_KEY=
VITE_NEWS_API_DATA_KEY=
`

# Way to run the app at docker

- Build docker image: `docker build -t news:dev .`
- Cammand to check image : `docker images`
- docker run: `docker run --env-file .env -p 5173:5173 news:dev`
- place .env file at package level