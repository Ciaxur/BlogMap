import { IAuthor } from './Author.model';
import { IPaper } from './Paper.model';

/** DATABASE INFUSED INTERFACES */
interface DatabaseOptions {
  _id:        string,
  createdAt:  Date,
  updatedAt:  Date,
}
interface IAuthorDb extends DatabaseOptions, IAuthor {}
interface IPaperDb extends DatabaseOptions, IPaper {}
interface IQueryResponse<T> {
  data: T[],
  length: number,
}

// Source of Truth, if import needs to be a General Database
export type { IPaper, IPaperType } from './Paper.model';
export type { IAuthor } from './Author.model';
export type { IAuthorDb, IPaperDb, IQueryResponse };
