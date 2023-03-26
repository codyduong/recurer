# recurer

An application designed to encourage "recur". Design your own workflows to maximize your chances of
building habits and encourage productivity.

This repository's structure as well as code decisions were highly influenced from learnings obtained
during the development of [codyduong.dev](https://github.com/codyduong/codyduong.dev)

## Getting Started

**Pre-reqs**
* MongoDB cluster
* Firebase Project

**Steps**
* Setup the `.env` variables as specified in `.env-EXAMPLE` files.
* Install required deps with `yarn install` in both [`frontend/web`](./backend/graphql/) and [`frontend/web`](./frontend/web/)
  * Start the web server with `yarn start` while in [`frontend/web`](./frontend/web/)
  * Start the api server with `yarn start` while in [`backend/graphql`](./backend/graphql/)