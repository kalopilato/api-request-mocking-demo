import { rest } from "msw";

import searchResults from "./fixtures/documentSearch";
import readingList from "./fixtures/readingList";

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

const getReadingList = createConfigurableHandler(
  "get",
  "https://openlibrary.org/reading_list",
  { works: [] }
);

const getReadingListRelative = createConfigurableHandler(
  "get",
  "/reading_list",
  { works: [] }
);

const addToReadingList = createConfigurableHandler(
  "post",
  "https://openlibrary.org/reading_list/add",
  undefined
);

const handlers = [getReadingList(), searchDocuments(), addToReadingList(), getReadingListRelative()];

export default handlers;
export { addToReadingList, getReadingList, searchDocuments };
