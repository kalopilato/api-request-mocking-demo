import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "./apiMocks/server";
import { searchDocuments } from "./apiMocks/handlers";
import { errorResponse } from "./apiMocks/fixtures/documentSearch";

import App from "./App";

it("enables the search button after entering text", () => {
  render(<App />);

  let searchButton = screen.getByRole("button", { name: /^search$/i });
  expect(searchButton).toBeDisabled();
  userEvent.type(screen.getByLabelText(/^search$/i), "the secret life of cats");
  expect(searchButton).not.toBeDisabled();
});

// MSW responds to our search request with the handler defined in `server.js` by default
it("searches for a document and displays the results", async () => {
  render(<App />);

  let searchField = screen.getByLabelText(/^search$/i);
  userEvent.type(searchField, "the secret life of cats");
  let searchButton = screen.getByRole("button", { name: /^search$/i });
  userEvent.click(searchButton);

  await screen.findByText(/^the secret life of cats by claire bessant$/i);
  screen.getByText(/^mocked store link: https:\/\/fake.store.com\/1$/i);
  screen.getByText(/^the secret life of cats by ralph reese$/i);
  screen.getByText(/^mocked store link: https:\/\/fake.store.com\/2$/i);
});

// And we can override the default handler in `server.js` to define responses case by case
it("searches for a document and displays an error message when the request fails", async () => {
  render(<App />);

  server.use(searchDocuments({ status: 500, fixture: errorResponse }));

  let searchField = screen.getByLabelText(/^search$/i);
  userEvent.type(searchField, "the secret life of cats");
  let searchButton = screen.getByRole("button", { name: /^search$/i });
  userEvent.click(searchButton);

  await screen.findByText(/^something went wrong: internal server error$/i);
});

// We can also define a 'one-time' response before falling back to the default response
it("can retry searching for a document after receiving an error the first time", async () => {
  render(<App />);

  server.use(searchDocuments({ status: 500, fixture: errorResponse }));

  let searchField = screen.getByLabelText(/^search$/i);
  userEvent.type(searchField, "the secret life of cats");
  let searchButton = screen.getByRole("button", { name: /^search$/i });
  userEvent.click(searchButton);

  await screen.findByText(/^something went wrong: internal server error$/i);

  userEvent.click(searchButton);
  await screen.findByText(/^the secret life of cats by claire bessant$/i);
  screen.getByText(/^the secret life of cats by ralph reese$/i);
});
