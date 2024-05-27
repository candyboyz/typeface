import opentype from "opentype.js";
import type {
  PathType,
  ReadOptions,
  TokenType,
  TypefaceFont,
  TypeFace,
} from "./types";

const read = (buffer: ArrayBuffer, options?: ReadOptions) => {
  const font = opentype.parse(buffer);

  const config: ReadOptions = { reverseTypeface: false, ...options };

  return converter(font, config);
};

const converter = (font: opentype.Font, config: ReadOptions) => {
  const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72);

  const result: TypefaceFont = {};

  result.glyphs = {};

  const restriction: { range: null | number[]; set: null | string } = {
    range: null,
    set: null,
  };

  if (config.restrictCharacters !== undefined) {
    const restrictCharacters = config.restrictCharacters;
    const rangeSeparator = "-";

    if (restrictCharacters.indexOf(rangeSeparator) != -1) {
      const rangeParts = restrictCharacters.split(rangeSeparator);
      if (
        rangeParts.length === 2 &&
        !isNaN(Number(rangeParts[0])) &&
        !isNaN(Number(rangeParts[1]))
      ) {
        restriction.range = [parseInt(rangeParts[0]), parseInt(rangeParts[1])];
      }
    }

    if (!restriction.range) restriction.set = restrictCharacters;
  }

  Array(...Array(font.glyphs.length)).forEach((_, index) => {
    const glyph = font.glyphs.get(index);
    const unicodes: number[] = [];

    if (glyph.unicode) unicodes.push(glyph.unicode);

    if (glyph.unicodes.length) {
      glyph.unicodes.forEach((unicode) => {
        if (unicodes.indexOf(unicode) == -1) unicodes.push(unicode);
      });
    }

    unicodes.forEach((unicode) => {
      const glyphCharater = String.fromCharCode(unicode);
      let needToExport = true;

      if (restriction.range) {
        needToExport =
          unicode >= restriction.range[0] && unicode <= restriction.range[1];
      } else if (restriction.set) {
        if (config.restrictCharacters)
          needToExport = config.restrictCharacters.indexOf(glyphCharater) != -1;
      }

      if (needToExport) {
        const token: TokenType = {
          ha: 0,
          x_min: 0,
          x_max: 0,
          o: "",
        };

        token.ha = glyph.advanceWidth
          ? Math.round(glyph.advanceWidth * scale)
          : 0;

        token.x_min = glyph.xMin ? Math.round(glyph.xMin * scale) : 0;
        token.x_max = glyph.xMax ? Math.round(glyph.xMax * scale) : 0;

        token.o = "";

        if (config.reverseTypeface)
          glyph.path.commands = reverseCommands(glyph.path.commands);

        glyph.path.commands.forEach((c, index) => {
          const command = c as any as PathType;

          if (command.type.toLowerCase() === "c") command.type = "b";

          token.o += command.type.toLowerCase();

          token.o += " ";

          if (command.x !== undefined && command.y !== undefined) {
            token.o += Math.round(command.x * scale);
            token.o += " ";
            token.o += Math.round(command.y * scale);
            token.o += " ";
          }

          if (command.x1 !== undefined && command.y1 !== undefined) {
            token.o += Math.round(command.x1 * scale);
            token.o += " ";
            token.o += Math.round(command.y1 * scale);
            token.o += " ";
          }

          if (command.x2 !== undefined && command.y2 !== undefined) {
            token.o += Math.round(command.x2 * scale);
            token.o += " ";
            token.o += Math.round(command.y2 * scale);
            token.o += " ";
          }
        });

        if (result.glyphs) result.glyphs[String.fromCharCode(unicode)] = token;
      }
    });
  });

  result.familyName = font.names.fullName.en;
  result.ascender = Math.round(font.ascender * scale);
  result.descender = Math.round(font.descender * scale);
  result.underlinePosition = Math.round(
    font.tables.post.underlinePosition * scale,
  );
  result.underlineThickness = Math.round(
    font.tables.post.underlineThickness * scale,
  );

  result.boundingBox = {
    yMin: Math.round(font.tables.head.yMin * scale),
    xMin: Math.round(font.tables.head.xMin * scale),
    yMax: Math.round(font.tables.head.yMax * scale),
    xMax: Math.round(font.tables.head.xMax * scale),
  };

  result.resolution = 1000;
  result.original_font_information = font.tables.name;

  if (font.names.fontSubfamily.en.toLowerCase().indexOf("bold") > -1) {
    result.cssFontWeight = "bold";
  } else {
    result.cssFontWeight = "normal";
  }

  if (font.names.fontSubfamily.en.toLowerCase().indexOf("italic") > -1) {
    result.cssFontStyle = "italic";
  } else {
    result.cssFontStyle = "normal";
  }

  console.log(result);
  return result;
};

const reverseCommands = (commands: opentype.PathCommand[]) => {
  const paths: opentype.PathCommand[][] = [];
  const path: opentype.PathCommand[] = [];

  commands.forEach((command) => {
    if (command.type.toLowerCase() === "m") {
      path.push(command);
      paths.push(path);
    } else if (command.type.toLowerCase() !== "z") path.push(command);
  });

  const reversed: any[] = [];

  paths.forEach((p) => {
    const path = p as any as PathType[];

    const result: PathType = {
      type: "m",
      x: path[path.length - 1]?.x,
      y: path[path.length - 1]?.y,
    };

    reversed.push(result);

    for (let i = path.length - 1; i > 0; i--) {
      const command = path[i];

      result.type = command.type;

      if (command.x2 !== undefined && command.y2 !== undefined) {
        result.x1 = command.x2;
        result.y1 = command.y2;
        result.x2 = command.x1;
        result.y2 = command.y1;
      } else if (command.x1 !== undefined && command.y1 !== undefined) {
        result.x1 = command.x1;
        result.y1 = command.y1;
      }

      result.x = path[i - 1].x;
      result.y = path[i - 1].y;
      reversed.push(result);
    }
  });

  return reversed;
};

const typeface: TypeFace = { read };

export default typeface;
export { read };
export type { PathType, ReadOptions, TokenType, TypefaceFont, TypeFace };
