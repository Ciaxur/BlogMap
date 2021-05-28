import { IAuthor, IAuthorDb, IPaper, IPaperDb } from '../../Database';
import { IRootStore } from '../RootStore';

/** PAYLOAD SECTION */
export type RootReducerAction = 
  'SET_BACKEND_URI' | 'SET_INIT_STORE' |
  'ADD_PAPER'   | 'REM_PAPER'  | 'MOD_PAPER' |
  'ADD_AUTHOR'  | 'REM_AUTHOR' | 'MOD_AUTHOR';
  
export interface RootReducerPayload{
  type: RootReducerAction,
  data: IPaper | IPaperDb | IAuthor | IAuthorDb | IRootStore | string,
}

export const rootReducer = (state: IRootStore, payload: RootReducerPayload): IRootStore => {
  switch(payload.type) {
    case 'SET_INIT_STORE':
      return payload.data as IRootStore;
    case 'ADD_AUTHOR':
    case 'MOD_AUTHOR':
      const author: IAuthorDb = payload.data as IAuthorDb;
      return {
        ...state,
        db: {
          ...state.db,
          authors: {
            ...state.db.authors,
            [author._id]: author,
          },
        },
      };
    case 'ADD_PAPER':
    case 'MOD_PAPER':
      const paper: IPaperDb = payload.data as IPaperDb;
      return {
        ...state,
        db: {
          ...state.db,
          papers: {
            ...state.db.papers,
            [paper._id]: paper,
          },
        },
      };
    case 'REM_AUTHOR':
      const authorRem: IAuthorDb = payload.data as IAuthorDb;
      return {
        ...state,
        db: {
          ...state.db,
          authors: Object.entries(state.db.authors)
            .reduce((acc, entry) => (entry[0] !== authorRem._id
              ? { ...acc, [entry[0]]: entry[1] }
              : acc
            ), {}),
        },
      };
    case 'REM_PAPER':
      const paperRem: IPaperDb = payload.data as IPaperDb;
      return {
        ...state,
        db: {
          ...state.db,
          papers: Object.entries(state.db.papers)
            .reduce((acc, entry) => (entry[0] !== paperRem._id
              ? { ...acc, [entry[0]]: entry[1] }
              : acc
            ), {}),
        },
      };
    case 'SET_BACKEND_URI':
      return {
        ...state,
        uri: {
          ...state.uri,
          backend: payload.data as string,
        },
        
        db: {
          ...state.db,
        },
      };
    default:
      return state;
  }
};
