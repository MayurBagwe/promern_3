/* global db print */
/* eslint no-restricted-globals: "off" */

db.products.remove({});
const productsDB = [
  {
    id: 1,
    category: "Shirts",
    name: "Levis Shirt",
    price: 100,
    image: "Test.com",
  },
  {
    id: 2,
    category: "Jeans",
    name: "Pepe Jeans",
    price: 150,
    image: "test.com",
  },
];

db.products.insertMany(productsDB);
const count = db.products.count();
print("Inserted", count, "products");
db.counters.remove({ _id: "products" });
db.counters.insert({ _id: "products", current: count });
db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: 1 });
db.products.createIndex({ image: 1 });
