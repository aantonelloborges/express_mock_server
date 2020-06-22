# express_mock_server

# For simplicity, you'll store data in-memory and not in an external database.

Bootstrap a Node.js, Express, and TypeScript Project
Start by creating a project directory anywhere in your system and making it your current directory:

```bash
mkdir express-ts-api
cd express-ts-api
```

Next, initialize a Node.js project within the project directory by creating a package.json file with default settings:

```bash
npm init -y
```

# Install Project Dependencies

Your Node.js project requires a couple of dependencies to create a secure Express server with TypeScript. Install them like so:

```bash
npm i express dotenv cors helmet
```

Here's what each of the above packages does in your project:

* express: Fast, unopinionated, minimalist web framework for Node.js.
* dotenv: Zero-dependency module that loads environment variables from a .env file into process.env.
* cors: Express middleware to enable CORS with various options.
* helmet: Express middleware to secure your apps by setting various HTTP headers, which mitigate common attack vectors.

To use TypeScript, you also need to install a stable version of typescript as a developer dependency:

```bash
npm i -D typescript
```

To use TypeScript effectively, you need to install type definitions for the packages you installed previously:

```bash
npm i -D @types/node @types/express @types/dotenv @types/cors @types/helmet
```

When a package doesn't have built-in types, you can get its type definitions through the @types npm namespace, which hosts TypeScript type definitions from the DefinitelyTyped project. Once the packages are installed, the types are automatically included by the TypeScript compiler and your IDE can use them to provide you with code assistance.

# Initialize TypeScript with Node.js

To help the TypeScript compiler understand the structure of your project, you need to create a tsconfig.json file within the directory that you want to use as the root directory of the TypeScript project. In this case, your project directory and the TypeScript project directory are the same.

To easily generate the tsconfig.json file, ensure that you are under the project directory and issue the following command:

```bash
npx tsc --init
```

That's all that you need for now to configure your TypeScript project with sensible defaults.

# Use Environmental Variables

Instead of using hard-coded configuration variables within files throughout your project, you can define all those variables in a central location and load them into the file modules that need them. This central location is commonly defined as a hidden file named .env, which you can create as follows:

```bash
touch .env
```

Populate the .env hidden file with the following variable that defines the port your server can use to listen for requests:

PORT=7000

As seen in the next section, any module of your project can load the variables defined within .env using the dotenv package.

⚠️ Caution: A .env file may contain sensitive information, such as API keys or secrets. Thus, add it to a project's .gitignore file to prevent it from being committed to version control.

# Create a Node App with Express Using TypeScript

To keep your application well-organized, create an src directory to host your Node.js application files:

```bash
mkdir src
```

Under this src directory, create a file named index.ts to serve as the entry point of the application:

```bash
touch src/index.ts
```

Add to index.ts the following template that outlines an Express server:

```ts
/**
 * Required External Modules
 */

/**
 * App Variables
 */

/**
 *  App Configuration
 */

/**
 * Server Activation
 */

/**
 * Webpack HMR Activation
 */
```

Next, under the Required External Modules section, import the project dependencies you installed earlier and load any environmental variables from the local .env file using the dotenv.config() method:

```ts
/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

dotenv.config();
```

Under the App Variables section, check if the environmental variable PORT was loaded into process.env. If so, parse its value as a number type and create an instance of an Express application; otherwise, exit the application:

```ts
/**
 * App Variables
 */

if (!process.env.PORT) {
   process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
```

Under the App Configuration section, mount the middleware functions from the packages that you are importing into this entry point module:

```ts
/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
```

helmet is a collection of 14 small middleware functions that set HTTP response headers. Mounting helmet() doesn't include all of these middleware functions but provides you with sensible defaults such as DNS Prefetch Control, Frameguard, Hide Powered-By, HSTS, IE No Open, Don't Sniff Mimetype, and XSS Filter.

By mounting cors(), you enable all CORS requests. With express.json(), you parse incoming requests with JSON payloads, which populates the request object with a new body object containing the parsed data.

Finally, under the Server Activation section, you create an Express server:

```ts
/**
 * Server Activation
 */

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
```

# Set Up Hot-Module Replacement (HMR) for TypeScript with Webpack
The TypeScript compilation process can increase the bootstrapping time of an application. However, you don't need to recompile the entire project whenever there's a change in its source code. Borrowing a page from the NestJS docs, you can set up webpack Hot-Module Replacement (HMR) to significantly decrease the time it takes to restart your application when you make a change.

## Install Webpack Dependencies for TypeScript
Start by installing these packages to create a webpack development workflow:

```bash
npm i -D ts-loader webpack webpack-cli webpack-node-externals
```

* ts-loader: A TypeScript loader for webpack, which helps preprocess TypeScript files to create a JavaScript bundle.

* webpack: A module bundler, which is capable of transforming, bundling, or packaging just about any resource or asset.

* webpack-cli: A module that provides a flexible set of commands for developers to increase speed when setting up a custom webpack project.

* webpack-node-externals: A module to easily exclude Node.js modules from a webpack bundle.

Once these packages are installed, create a webpack.config.ts file under the project directory:

```bash
touch webpack.config.ts
```

Populate webpack.config.ts as follows:

```ts
const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: ["webpack/hot/poll?100", "./src/index.ts"],
  watch: true,
  target: "node",
  externals: [
    nodeExternals({
      whitelist: ["webpack/hot/poll?100"]
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js"
  }
};
```

A lot is happening in this webpack configuration file, but these are the high-level tasks that you need to understand:

* Define the location of the entry file of the application: ./src/index.ts.

* Define the loader that webpack needs to use to compile your source files: ts-loader for any files with the .ts or .tsx extensions.

* Define the directory where webpack should store the compiled source files: a dist directory under the project directory.

🐠 For a deep dive, visit the Hot-Module Replacement document.

## Enable Hot-Module Replacement in an Express application
To enable Hot-Module Replacement (HMR) in your Express server, you need to update the index.ts file, so what when a change happens within your source code, you tell webpack to accept the updated module.

Open the index.ts file and add the following under the Webpack HMR Activation section:

```ts
/**
 * Webpack HMR Activation
 */

if (module.hot) {
   module.hot.accept();
   module.hot.dispose(() => server.close());
}
```

Here, you detect if Hot-Module Replacement has been enabled via the HotModuleReplacementPlugin for the module defined within index.ts. If HMR is enabled, the module exposes the module.hot interface, which you can use to perform operations on the module.

You use the accept() interface method to accept updates for the given module and its dependencies. After that's complete, you use the dispose() interface method to perform an action when the current module is finally replaced. The dispose action should remove any persistent resources that you have created, such as terminating your Node.js app and draining all existing connections.

Since module is not defined anywhere in the file, the TypeScript compiler throws an error: the hot property is not defined. To fix this, you can borrow a page from the ngxs project, a state management library for Angular.

ngxs provides an hmr-plugin that has a comprehensive type definition for the webpack hot module. Update the Webpack HMR Activation section as follows:

```ts
/**
 * Webpack HMR Activation
 */

type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void,
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
Now, you can get solid code completion from your IDE and type-checking assistance from the TypeScript compiler on module.

Run the Node-Express TypeScript server
With HMR set up, you can create two scripts in package.json to run your server, start and webpack:

{
  "name": "simple-express-ts-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node dist/index",
    "webpack": "webpack --config webpack.config.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

The webpack script runs the configuration that you set up in webpack.config.ts, which creates a JavaScript bundle, index.js, within a dist directory. In turn, the start script runs that bundle using node.

To run the project, first invoke the webpack script to create the bundle:

```bash
npm run webpack
```

Then, in a separate terminal tab or window, invoke the start script to run the bundle:

```bash
npm start
```

In the terminal, you see the "Listening on port 7000" message, indicating that you've set up the server correctly to listen for requests on port 7000. You are ready to develop this application further using TypeScript interfaces to define data models, services to manipulate the API resources, and much more.



# HTTPs with SSL

## Create a openssl-custom.cnf

```bash
touch openssl-custom.cnf
```

Add the following lines to openssl-custom.cnf file.

```bash
[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = <COUNTRY>
ST = <STATE>
L = <LOCALITY / CITY>
O = <ORGANIZATION>
OU = <ORGANIZATION_UNIT>
emailAddress = <EMAIL_ADDRESS>
CN = <HOSTNAME / IP_ADDRESS>

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.localhost
DNS.2 = localhost
```

⚠️ Caution: Remember to change the field options like this:

```bahs
[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = BR	
ST = SP
L = São Paulo
O = IT
OU = IT Department
emailAddress = aantonelloborges@gmail.com
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.localhost
DNS.2 = localhost
```

## Generate de SSL certification and key

Run the below command line:

```bash
openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout server.key \
    -new \
    -out server.crt \
    -config ./openssl-custom.cnf \
    -sha256 \
    -days 365
```