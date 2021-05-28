const PaperType = [ 'Block', 'Article', 'White-Paper' ] as const;
export type IPaperType = typeof PaperType[number];
export interface IPaper {
  title:      string,
  body:       string,
  type:       IPaperType,
  author:     string,
}