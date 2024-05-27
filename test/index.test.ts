import typeface from "../src";

test("Test Get TypeFace Standard", async () => {
  const resp = await fetch(
    "https://fonts.gstatic.com/s/roboto/v15/W5F8_SL0XFawnjxHGsZjJA.ttf",
  );
  const arrayBuffer = await resp.arrayBuffer();
  const font = typeface.read(arrayBuffer);

  expect(font.glyphs && font.glyphs[0].o).toBe(
    "m 701 584 l 701 421 q 626 94 701 201 q 391 -14 551 -14 l 391 -14 q 157 91 233 -14 q 78 404 81 196 l 78 404 l 78 572 q 153 895 78 789 q 389 1001 229 1001 l 389 1001 q 624 899 549 1001 q 701 584 699 797 l 701 584 z m 576 387 l 576 593 q 531 825 576 752 q 389 898 486 898 l 389 898 q 249 825 293 898 q 203 602 205 753 l 203 602 l 203 401 q 250 165 203 241 q 391 89 296 89 l 391 89 q 529 161 484 89 q 576 387 574 233 l 576 387 z ",
  );
});

test("Test Get TypeFace Reverse", async () => {
  const resp = await fetch(
    "https://fonts.gstatic.com/s/roboto/v15/W5F8_SL0XFawnjxHGsZjJA.ttf",
  );
  const arrayBuffer = await resp.arrayBuffer();
  const font = typeface.read(arrayBuffer, { reverseTypeface: true });

  expect(font.glyphs && font.glyphs[0].o).toBe(
    "l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 l 701 584 701 201 ",
  );
});

test("Test Get TypeFace Restrict", async () => {
  const resp = await fetch(
    "https://fonts.gstatic.com/s/roboto/v15/W5F8_SL0XFawnjxHGsZjJA.ttf",
  );
  const arrayBuffer = await resp.arrayBuffer();
  const font = typeface.read(arrayBuffer, { restrictCharacters: "abc" });

  let characters = "";

  for (const char in font.glyphs) {
    characters += char;
  }

  expect(characters).toBe("abc");
});
