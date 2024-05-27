export interface ReadOptions {
  restrictCharacters?: string;
  reverseTypeface?: boolean;
}

export interface TypefaceFont {
  glyphs?: {
    [key: string]: {
      ha: number;
      x_min: number;
      x_max: number;
      o: string;
    };
  };
  familyName?: string;
  ascender?: number;
  descender?: number;
  underlinePosition?: number;
  underlineThickness?: number;
  boundingBox?: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
  resolution?: number;
  original_font_information?: opentype.Table;
  cssFontWeight?: string;
  cssFontStyle?: string;
}

export interface TokenType {
  ha: number;
  x_min: number;
  x_max: number;
  o: string;
}

export interface PathType {
  type: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface TypeFace {
  read: (buffer: ArrayBuffer, options?: ReadOptions) => TypefaceFont;
}
