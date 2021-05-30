import { createContext } from 'react';
import { IAuthor, IAuthorDb, IPaper, IPaperDb } from '../Database';

export interface IRootStore {
  // Uris
  uri: {
    backend: string,

    // Actions
    setBackendUri: (state: IRootStore, uri: string) => void,
  },
  
  // Database Store & Cache
  db: {
    // State of Syncing Data with Remote DB
    synced: boolean,
    lastSynced: Date | null,

    papers: { [paperId: string]: IPaper },
    authors: { [authorId: string]: IAuthor },

    // Actions
    addPaper: (state: IRootStore, newPaper: IPaper)  => Promise<IPaperDb>,
    modPaper: (state: IRootStore, paper: IPaper)  => Promise<IPaper>,
    remPaper: (state: IRootStore, paper: IPaper) => Promise<IPaper>,
    
    addAuthor: (state: IRootStore, newAuthor: IAuthor) => Promise<IAuthorDb>,
    modAuthor: (state: IRootStore, author: IAuthor)  => Promise<IAuthor>,
    remAuthor: (state: IRootStore, author: IAuthor) => Promise<IAuthor>,
  },
}

// Default Context
export const DefaultRootContext: IRootStore = {
  uri: {
    backend: '',

    // Actions
    setBackendUri: (() => null) as any,
  },
  
  db: {
    synced: false,
    lastSynced: null,
    
    papers: {},
    authors: {},

    // Actions
    addPaper: (()  => null) as any,
    modPaper: (() => null) as any,
    remPaper: (() => null) as any,
    
    addAuthor: (() => null) as any,
    modAuthor: (() => null) as any,
    remAuthor: (() => null) as any,
  },
};

// Export Default Context
export const RootContext = createContext<IRootStore>(DefaultRootContext);

