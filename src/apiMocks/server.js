import { setupServer } from "msw/node";
import handlers from "./handlers";

/**
 * Request stubs for the test suite go here. Any requests made by components under test
 * that match against a defined handler will be resolved with the stubbed response.
 *
 * See `handlers.js` for more details.
 */

const server = setupServer(...handlers);

export { server };
