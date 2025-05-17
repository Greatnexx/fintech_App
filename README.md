
## To this Project running

- create a `.env` file in the root and copy the content of `.env.example` into it with the correct credentials
- make sure your DB is up and running
- run `npm i` || `yarn`
- run `npm start:db` if you have dcoker running and wish to server your db using docker, if you are ok spinning up a local db version, you can
- then run `npm generate` to generate your prisma client
- then run `npm migrate` and `yarn studio` to view your DB
- then run `npm run dev` || `yarn dev`

All the type definitions, models and resolvers are placeholders and won't make it into the final application
