import React from 'react';
import axios from 'axios';
import { RootReducerPayload, SyncPayload } from '../Reducers/RootReducer';
import { IRootStore } from '../RootStore';
import {
  IAuthor, IAuthorDb, IPaper, IPaperDb, IQueryResponse,
} from '../../Database';

type RootStoreDispatch = React.Dispatch<RootReducerPayload>;

export function setBackendUri(uri: string, store: IRootStore, dispatch: RootStoreDispatch): void {
  dispatch({
    type: 'SET_BACKEND_URI',
    data: uri,
  });
}

/**
 * Populates Database Store with Papers and Authors
 * @param store Current state of the Root Store
 * @param dispatch Root Store Dispatch
 */
export function populateDatabaseStore(store: IRootStore, dispatch: RootStoreDispatch): Promise<[IAuthor, IPaper]> {
  // Assume Synced
  dispatch({
    type: 'SET_SYNC_STATUS', data: {
      lastSynced: new Date(),
      synced: true,
    } as SyncPayload,
  });

  // Request Paper Data
  const paperRequest = axios.get(`${store.uri.backend}/api/v0/paper`)
    .then(res => res.data)
    .then((data: IQueryResponse<IPaper>) => {
      dispatch({ type: 'SET_PAPERS', data: data.data as IPaperDb[] });
      return data;
    })
    .catch(err => {
      console.log('Populate Database Store: Error Requesting Papers.', err.response);
      return err.response;
    });
  
  // Request Authors Data
  const authorRequest = axios.get(`${store.uri.backend}/api/v0/author`)
    .then(res => res.data)
    .then((data: IQueryResponse<IAuthor>) => {
      dispatch({ type: 'SET_AUTHORS', data: data.data as IAuthorDb[] });
      return data;
    })
    .catch(err => {
      console.log('Populate Database Store: Error Requesting Authors.', err.response);
      return err.response;
    });
  
  // Forward Promise Data
  return Promise.all([
    paperRequest, authorRequest,
  ]);
}

export async function addAuthor(author: IAuthor, store: IRootStore, dispatch: RootStoreDispatch): Promise<IAuthorDb> {
  // Post Request to Add new Author
  return axios.post(`${store.uri.backend}/api/v0/author`, author)
    .then(res => res.data)
    .then(data => {
      // Add Author to Root Store
      dispatch({ type: 'ADD_AUTHOR', data: data.data });
      return data.data;
    })
    .catch(err => Promise.reject(err.response));
}

export async function remAuthor(author: IAuthor, store: IRootStore, dispatch: RootStoreDispatch): Promise<IAuthor> {
  const { _id } = author as IAuthorDb;

  // Remove from Store
  dispatch({ type: 'REM_AUTHOR', data: author });

  return axios.delete(`${store.uri.backend}/api/v0/author/${_id}`)
    .then(res => res.data)
    .then((data: IQueryResponse<IAuthorDb>) => {
      return data.data;
    })
    .catch(err => Promise.reject(err.response) as any);
}

export async function modAuthor(author: IAuthor, store: IRootStore, dispatch: RootStoreDispatch): Promise<IAuthor> {
  const { _id } = author as IAuthorDb;
  
  // Remove from Store
  dispatch({ type: 'MOD_AUTHOR', data: author });

  return axios.patch(`${store.uri.backend}/api/v0/author/${_id}`, {
    name: author.name,
  } as IAuthor)
    .then(res => res.data)
    .then((data: IQueryResponse<IAuthorDb>) => {
      return data.data;
    })
    .catch(err => Promise.reject(err.response) as any);
}

export async function addPaper(paper: IPaper, store: IRootStore, dispatch: RootStoreDispatch): Promise<IPaperDb> {
  // Post Request to Add new Paper
  return axios.post(`${store.uri.backend}/api/v0/paper`, paper)
    .then(res => res.data)
    .then((data: IQueryResponse<IPaperDb>) => {
      // Add Paper to Root Store
      dispatch({ type: 'ADD_PAPER', data: data.data });
      return data.data;
    })
    .catch(err => Promise.reject(err.response) as any);
}

export async function remPaper(paper: IPaper, store: IRootStore, dispatch: RootStoreDispatch): Promise<IPaper> {
  const { _id } = paper as IPaperDb;
  
  // Remove from Store
  dispatch({ type: 'REM_PAPER', data: paper });

  return axios.delete(`${store.uri.backend}/api/v0/paper/${_id}`)
    .then(res => res.data)
    .then((data: IQueryResponse<IPaperDb>) => {
      return data.data;
    })
    .catch(err => Promise.reject(err.response) as any);
}

export async function modPaper(paper: IPaper, store: IRootStore, dispatch: RootStoreDispatch): Promise<IPaper> {
  const { _id } = paper as IPaperDb;

  // Remove from Store
  dispatch({ type: 'MOD_PAPER', data: paper });

  return axios.patch(`${store.uri.backend}/api/v0/paper/${_id}`, {
    author: paper.author,
    body: paper.body,
    tags: paper.tags,
    category: paper.category || undefined,
    title: paper.title,
    type: paper.type,
  } as IPaper)
    .then(res => res.data)
    .then((data: IQueryResponse<IPaperDb>) => {
      return data.data;
    })
    .catch(err => Promise.reject(err.response) as any);
}
