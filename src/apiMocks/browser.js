import { rest, setupWorker } from "msw";
import { getReadingList } from "./handlers";
import readingList from "./fixtures/readingList";

const handlers = [
  // Patched Search API to include `store_link`
  rest.get("https://openlibrary.org/search.json", async (req, res, ctx) => {
    // Forward the intercepted request on to the real API and capture the response
    const response = await ctx.fetch(req);
    const responseData = await response.json();

    // Patch the response before returning it to the caller
    responseData.docs.forEach((doc) => {
      if (doc.store_link === undefined)
        doc.store_link = `https://fake.store.com/${
          doc.isbn?.length ? doc.isbn[0] : ""
        }`;
    });
    return res(ctx.json(responseData));
  }),
  // Mocked API to fetch Reading List
  getReadingList({ fixture: readingList }),
  // Mocked API to add a Document to the Reading List
  rest.post(
    "https://openlibrary.org/reading_list/add",
    async (req, res, ctx) => {
      let { workId } = req.body;
      readingList.works.push(workId);
      return res(ctx.status(200), ctx.delay(500));
    }
  ),
];

export const worker = setupWorker(...handlers);
