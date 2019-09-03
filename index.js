const { makeExecutableSchema } = require('graphql-tools');
const { useSofa, OpenAPI  } = require('sofa-api');
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();

const schema = makeExecutableSchema({
    typeDefs: /* GraphQL */`
        type Query {
            foo(bar: Int): String
        }
    `,
    resolvers: {
        Query: {
            foo: (_, { bar }) => bar && bar.toString(),
        }
    }
});

const openApi = OpenAPI({
  schema,
  info: {
    title: 'Example API',
    version: '3.0.0',
  },
});

app.use(
  '/api',
  useSofa({
    schema,
    onRoute(info) {
      openApi.addRoute(info, {
        basePath: '/api',
      });
    },
  })
);

// writes every recorder route
openApi.save('./swagger.json');

const swaggerDocument = require('./swagger.json');

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(4000);