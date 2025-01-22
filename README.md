# create .env file and place the url and api there

- News Urls
` VITE_NEWS_API=https://newsapi.org/v2
VITE_GUARDIANAPI=https://content.guardianapis.com
VITE_NEWS_API_DATA=https://newsdata.io/api/1 `

- News Api Key
`VITE_NEWS_API_KEY=26c2ff65a44449bf9f4a416c65719c4e
VITE_GUARDIANAPI_KEY=d9081210-def2-420a-a331-57b67c014c07
VITE_NEWS_API_DATA_KEY=pub_66111e9b448f4d5e3d2080dded7e8293d6cd3
`

# Way to run the app at docker

- Build docker image: `docker build -t news:dev .`
- Cammand to check image : `docker images`
- docker run: `docker run --env-file .env -p 5173:5173 news:dev`
- place .env file at package level