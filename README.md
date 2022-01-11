# Example app with [chakra-ui](https://github.com/chakra-ui/chakra-ui)

This example features how to use [chakra-ui](https://github.com/chakra-ui/chakra-ui) as the component library within a Next.js app.

We are connecting the Next.js `_app.js` with `chakra-ui`'s Theme and ColorMode containers so the pages can have app-wide dark/light mode. We are also creating some components which shows the usage of `chakra-ui`'s style props.

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-chakra-ui)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui&project-name=with-chakra-ui&repository-name=with-chakra-ui)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-chakra-ui with-chakra-ui-app
# or
yarn create next-app --example with-chakra-ui with-chakra-ui-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Notes

Chakra has supported Gradients and RTL in `v1.1`. To utilize RTL, [add RTL direction and swap](https://chakra-ui.com/docs/features/rtl-support).

If you don't have multi-direction app, you should make `<Html lang="ar" dir="rtl">` inside `_document.js`.

# Development steps
- `yarn add urql graphql`
- add fetch options to graphql client and set `credentials` to  `"include"`, this will send the cookie on request.
- solve `CORS` issue on the server side.
- add `graphql code generator`
    - `yarn add -D @graphql-codegen/cli`
- `initialize` code generator
    - `yarn graphql-codegen init`
- substitute `typescript-react-apollo` with `typescript-urql`
    - `yarn add -D @graphql-codegen/typescript-urql`
- add utility for handling errors comming from graphql server.
- add `register` and `login` pages
- use `Graphcache` for updating cache
    - `yarn add @urql/exchange-graphcache`
- update `me` query on `register` and `login` mutations
- add `fragments` to prevent duplications in graphql files
- add `logout` and `update the cache`
- add `server side rendering` (`ssr`) with graphql and urql
    - `yarn add next-urql`
    - `yarn add react-is`
    - `yarn add isomorphic-unfetch`
- wrap pages into `withUrqlClient` HOC
- `ssr` workflow
    - `me` ==> `browser` http://localhost:3000
    - `browser` ==> `next.js `server
    - `next.js` ==> request `graphql` server http://localhost:4000
    - `next.js` builds `HTML` with fetched `data` and send back to the `browser`
    - `next.js hint` => after loading a page ssr (initial render) and after that pages render client side(client side routing system)
- add `change password` page