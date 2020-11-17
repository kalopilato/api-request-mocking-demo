import { rest } from "msw";

import searchResults from "./fixtures/documentSearch";

function createConfigurableHandler(method, resource, defaultFixture) {
  return ({ fixture = defaultFixture, status = 200, delay = 0 } = {}) => {
    return rest[method](resource, async (_req, res, ctx) =>
      res(ctx.status(status), ctx.json(fixture), ctx.delay(delay))
    );
  };
}

const searchDocuments = createConfigurableHandler(
  "get",
  "https://openlibrary.org/search.json",
  searchResults
);

const handlers = [searchDocuments()];

export default handlers;
export { searchDocuments };
