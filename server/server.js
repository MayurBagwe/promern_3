const fs = require("fs");
const express = require("express");
const { ApolloServer, UserInputError } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { GraphQLEnumType } = require("graphql");

let aboutMessage = "Issue Tracker API v1.0";
const productDB = [];
/* const productDB = [
  {
    id: 1,
    category: CategoryType.Shirts,
    name: "Levis Shirt",
    image: "Test",
    price: "400",
  },
  {
    id: 2,
    category: CategoryType.Jeans,
    name: "Levis Jeans",
    image: "Test",
    price: "800",
  },
]; */

const GraphQLPrice = new GraphQLScalarType({
  name: "GraphQLPrice",
  description: "Price custom scalar type",
  serialize(value) {
    console.log("Serialize ", value);
    return value.toString();
  },

  parseValue(value) {
    console.log("before parseValue ", value);
    let first = value.replace(/[$]/g, "");
    console.log("after parseValue ", first);
    return first;
  },

  parseLiteral(ast) {
    console.log("First parseLiteral ", ast);
    // console.log("First Literal ", ast);
    if (ast.kind == Kind.Float) {
      let first = value.replace(/[$]/g, "");
      console.log("First Literal ", first);
      return first;
    }
  },
});

const resolvers = {
  Query: {
    about: () => aboutMessage,
    productsList,
  },
  Mutation: {
    setAboutMessage,
    productsAdd,
  },
  GraphQLPrice,
};

function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

function productsList() {
  return productDB;
}

function productValidate(product) {
  const errors = [];
  if (product.name.length < 1) {
    errors.push('Field "productname" is mandatory.');
  }
  if (product.price) {
    var regex = /^\s*-?[0-9]\d*(\.\d{1,2})?\s*$/;
    if (!regex.test(product.price)) {
      errors.push('Field "Price" incorrect.');
    }
  }

  if (errors.length > 0) {
    throw new UserInputError("Invalid input(s)", { errors });
  }
}

function productsAdd(_, { product }) {
  productValidate(product);
  product.id = productDB.length + 1;
  console.log("Before adding product ", product);
  productDB.push(product);

  console.log("Added product ", product);
  return product;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"),
  resolvers,
});

const port = 3001;
const app = express();
app.use(express.static("public"));
server.applyMiddleware({ app, path: "/graphql" });
app.listen(port, function () {
  console.log("Inventory App started on port " + port);
});
