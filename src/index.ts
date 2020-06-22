/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { itemsRouter } from "./items/items.router";
import { errorHandler } from "./middleware/error.middleware";
import {notFoundHandler} from "./middleware/notFound.middleware";

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
   process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
/**
    helmet is a collection of 14 small middleware functions that set HTTP response headers. 
    Mounting helmet() doesn't include all of these middleware functions 
    but provides you with sensible defaults such as DNS Prefetch Control, Frameguard, 
    Hide Powered-By, HSTS, IE No Open, Don't Sniff Mimetype, and XSS Filter.
 */
app.use(cors());
/**
    By mounting cors(), you enable all CORS requests. With express.json(), 
    you parse incoming requests with JSON payloads, which populates the request object 
    with a new body object containing the parsed data.
 */
app.use(express.json());

// Defining routes
app.use("/items", itemsRouter);

// Defining error handlings
app.use(errorHandler);
app.use(notFoundHandler);

/**
 * Server Activation
 */
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

/**
 * Webpack HMR Activation

    Set Up Hot-Module Replacement (HMR) for TypeScript with Webpack
    The TypeScript compilation process can increase the bootstrapping time of an application. 
    However, you don't need to recompile the entire project whenever there's a change in its source code. 
    Borrowing a page from the NestJS docs, you can set up webpack Hot-Module Replacement (HMR) 
    to significantly decrease the time it takes to restart your application when you make a change.
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