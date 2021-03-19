const fs = require("fs");
require("dotenv").config();
const express = require("express");
const { ApolloServer, UserInputError } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { GraphQLEnumType } = require("graphql");
const { MongoClient } = require("mongodb");

const url =
  process.env.DB_URL ||
  "mongodb+srv://MayurMongo:Mayurcs%402020@freeclusteraws.vcypi.mongodb.net/inventoryManagement?retryWrites=true";

let db;
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

async function getNextSequence(name) {
  const result = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false }
    );
  return result.value.current;
}

const GraphQLPrice = new GraphQLScalarType({
  name: "GraphQLPrice",
  description: "Price custom scalar type",
  serialize(value) {
    //console.log("Serialize ", value);
    return value.toString();
  },

  parseValue(value) {
    //console.log("before parseValue ", value);
    let first = value.replace(/[$]/g, "");
    /// console.log("after parseValue ", first);
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
  aboutMessage = message;
  return aboutMessage;
}

async function productsList() {
  //return productDB;
  const products = await db.collection("products").find({}).toArray();
  return products;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log("Connected to MongoDB at", url);
  db = client.db();
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

async function productsAdd(_, { product }) {
  productValidate(product);
  const newProduct = Object.assign({}, product);
  // newProduct.id = productDB.length + 1;
  newProduct.id = await getNextSequence("products");
  //console.log("Before adding product ", product);
  //productDB.push(product);
  const result = await db.collection("products").insertOne(newProduct);

  console.log("Added product ", product);
  const savedProduct = await db
    .collection("products")
    .findOne({ _id: result.insertedId });
  return savedProduct;
  //return product;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync("schema.graphql", "utf-8"),
  resolvers,
});

const app = express();
const enableCors = (process.env.ENABLE_CORS || "true") == "true";
console.log("CORS setting:", enableCors);
//app.use(express.static("public"));
server.applyMiddleware({ app, path: "/graphql", cors: enableCors });

const port = process.env.API_SERVER_PORT || 3000;

(async function start() {
  try {
    await connectToDb();
    app.listen(port, function () {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log("ERROR:", err);
  }
})();
