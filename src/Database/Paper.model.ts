export const PAPER_TYPE = [ 'Article', 'Block', 'White-Paper' ] as const;
export type IPaperType = typeof PAPER_TYPE[number];
export interface IPaper {
  title:      string,
  body:       string,
  type:       IPaperType,
  author:     string,
  category?:  string,
  tags:       string[],
}