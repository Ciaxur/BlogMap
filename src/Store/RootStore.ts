import { createContext } from 'react';
import { IAuthor, IPaper } from '../Database';

export interface IRootStore {
  // Uris
  uri: {
    backend: string,

    // Actions
    setBackendUri: (uri: string) => void,
  },
  
  // Database Store & Cache
  db: {
    papers: { [paperId: string]: IPaper },
    authors: { [authorId: string]: IAuthor },

    // Actions
    addPaper: (newPaper: IPaper)  => Promise<IPaper>,
    modPaper: (paper: IPaper)  => Promise<IPaper>,
    remPaper: (paper: IPaper) => Promise<IPaper>,
    
    addAuthor: (newAuthor: IAuthor) => Promise<IAuthor>,
    modAuthor: (author: IAuthor)  => Promise<IAuthor>,
    remAuthor: (author: IAuthor) => Promise<IAuthor>,
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

