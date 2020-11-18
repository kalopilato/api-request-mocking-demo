import { rest, setupWorker } from "msw";

const handlers = [
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
];

export const worker = setupWorker(...handlers);
