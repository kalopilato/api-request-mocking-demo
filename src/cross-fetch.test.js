import crossFetch from "cross-fetch";

describe("when using fetch", () => {
  it("with absolute url", async () => {
    const r = await fetch(`https://openlibrary.org/reading_list`).then((r) =>
      r.json()
    );

    expect(r).toMatchInlineSnapshot(`
    Object {
      "works": Array [],
    }
    `);
  });

  it("with relative url", async () => {
    const r = await fetch(`/reading_list`).then((r) => r.json());

    expect(r).toMatchInlineSnapshot(`
    Object {
      "works": Array [],
    }
    `);
  });
});

describe("when using cross-fetch", () => {
  it("with absolute url", async () => {
    const r = await crossFetch(
      `https://openlibrary.org/reading_list`
    ).then((r) => r.json());

    expect(r).toMatchInlineSnapshot(`
    Object {
      "works": Array [],
    }
    `);
  });

  it("with relative url", async () => {
    const r = await crossFetch(`/reading_list`).then((r) => r.json());

    expect(r).toMatchInlineSnapshot(`
    Object {
      "works": Array [],
    }
    `);
  });
});
