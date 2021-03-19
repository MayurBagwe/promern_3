## Steps to Setup the project
1. Clone the project and open it in VS Code **(Prerequisite - MongoDB Shell must be installed)**
2. Open the terminal and run following commands ---> **cd ui** ---> **npm install** ---> **npm run watch** 
3. Open another terminal and run ---> **cd ui** ---> **npm start**
4. Open another terminal and navigate to --> **cd api**  --->  **npm install** --> **npm start**
5. Open another terminal and run **__mongo mongodb+srv://MayurMongo:Mayurcs%402020@freeclusteraws.vcypi.mongodb.net/inventoryManagement__**
6. Mongo server will be started and run below commands to view records in the database
   - use inventoryManagement
   - db.products.find().pretty()
7. Open the browser and navigate to [Inventory Management -  Application Home Page](http://localhost:8000/) and insert a record.
8. GraphQL server [Inventory Management - GraphQL Server](http://localhost:3000/graphql)    


