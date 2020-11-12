import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

it("enables the search button after entering text", () => {
  render(<App />);

  let searchButton = screen.getByRole("button", { name: /^search$/i });
  expect(searchButton).toBeDisabled();
  userEvent.type(screen.getByLabelText(/^search$/i), "the secret life of cats");
  expect(searchButton).not.toBeDisabled();
});
