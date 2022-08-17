import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall, paginatedApiCall } from '../actions';
import {
  PaginatedEntity, PagedEntity, getDefaultMetaData, MetaData,
  HotUploadedFile,
} from '../models';

interface Entity<T> {
  entity:T;
  refreshEntity:()=>void;
  isLoader?:boolean
}
export const useEntity = <T extends unknown>
  (endpoint:string, alternateId?:string):(Entity<T|undefined>) => {
  let { id } = useParams<{id?:string}>();
  if (alternateId) {
    id = alternateId;
  }
  const reduxDispatch = useDispatch();
  const [entity, setEntity] = useState<T|undefined>(undefined);
  const [refresh, setRefresh] = useState(false);
  const [isLoader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      setLoader(true);
      reduxDispatch(apiCall(`${endpoint}/${id}`, (res) => {
        setEntity(res);
        setLoader(false);
      }, () => {
        setLoader(false);
        //  console.log(err);
      }));
    }
  }, [refresh, alternateId]);

  const refreshEntity = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return { entity, refreshEntity, isLoader };
};

interface SelectedEntity<T> {
  entity:T;
  refresh:(id?:(number|string))=>void;
}
export const useSelectedEntity = <T extends unknown>(
  endpoint:string,
  id?:(number|string)):(SelectedEntity<T|undefined>) => {
  const reduxDispatch = useDispatch();
  const [entity, setEntity] = useState<T|undefined>(undefined);
  const [entityId, setEntityId] = useState<(number|string|undefined)>(id);
  useEffect(() => {
    if (entityId) {
      reduxDispatch(apiCall(`${endpoint}/${entityId}`, (res) => {
        setEntity(res);
      }, (err) => { console.log(err); })); // eslint-disable-line no-console
    } else {
      setEntity(undefined);
    }
  }, [entityId]);

  const refresh = (newId?:(number|string)) => {
    setEntityId(newId);
  };

  return { entity, refresh };
};

interface PaginationData<T>{
  entity:PagedEntity<T>;
  documents?:any
  filter:MetaData<T>;
  updateFilters(filter:Partial<MetaData<T>>):void;
  applyFilters(loadMore?:boolean):void;
  resetFilters():void;
  loadMore():void;
  connectFilter:(name:string, extraProps?:Record<any, any>)=>(Filter:any)=>any;
}

export const usePagination = <T extends unknown>(
  paginateddEntity:PaginatedEntity,
  defaultFilter?:MetaData<T>,
):(PaginationData<T>) => {
  const reduxDispatch = useDispatch();
  const entity:PagedEntity<T> = useSelector((state:any) => state?.[paginateddEntity.key]);
  const {
    metadata: {
      total, page, limit, allowedFilters,
    },
  } = entity;
  const finalDefautFilter = defaultFilter ?? getDefaultMetaData();
  const [filter, setFilter] = useState<MetaData<T>>(finalDefautFilter);
  const [refreshEntity, setRefreshEntity] = useState({
    refresh: false,
    loadMore: false,
  });

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      total,
      page,
      limit,
      allowedFilters: [...allowedFilters],
    }));
  }, [total, page, limit, allowedFilters]);

  useEffect(() => {
    if (!paginateddEntity.stop) {
      reduxDispatch(paginatedApiCall(
        paginateddEntity.name,
        paginateddEntity.api,
        { ...filter },
        refreshEntity.loadMore,
      ));
    }
  }, [refreshEntity.refresh]);

  const updateFilters = (partialFilter:Partial<MetaData<T>>):void => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...partialFilter,
      page: finalDefautFilter.page,
      allowedFilters: [
        ...prevFilter.allowedFilters,
        ...(partialFilter?.allowedFilters ?? []),
      ],
      filters: {
        ...prevFilter.filters,
        ...(partialFilter?.filters ?? {}),
      },
    }));
  };

  const applyFilters = (loadMore = false) => {
    setRefreshEntity((prevRefresh) => ({
      ...prevRefresh,
      loadMore,
      refresh: !prevRefresh.refresh,
    }));
  };
  const resetFilters = () => {
    setFilter(finalDefautFilter);
    applyFilters();
  };

  const loadMore = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: (prevFilter.page + 1),
    }));
    applyFilters(true);
  };

  const connectFilter = (name:string,
    { autoApplyFilters, formatValue, ...extraProps }:Record<any, any> = {}) => (Filter:any) => (
      <Filter
        {...extraProps}
        name={name}
        key={name}
        value={filter?.filters?.[name]}
        onChange={(value:any) => {
          updateFilters({
            filters: { [name]: formatValue ? formatValue(value) : value },
          });
          if (autoApplyFilters) {
            applyFilters();
          }
        }}
      />
  );


  return {
    entity,
    filter,
    updateFilters,
    applyFilters,
    resetFilters,
    loadMore,
    connectFilter,
  };
};

export const useAttachmentLink = (path?:string):{
 link: (string|undefined);
 refreshing:boolean;
 refreshLink():void
} => {
  const [link] = useState<string|undefined>(undefined);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    // const isUnmounted = false;
    if (path) {
      setRefreshing(true);
    }
    return () => {
      // isUnmounted = true;
    };
  }, [refresh]);

  const refreshLink = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return { link, refreshing, refreshLink };
};

export const UPDATE_FILES = 'UPDATE_FILES';
export const ADD_FILES = 'ADD_FILES';
export const REMOVE_FILE = 'REMOVE_FILE';
export const RESET_FILES = 'RESET_FILES';
export const VALIDATE_FILES = 'VALIDATE_FILES';
export const VALID_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'application/octet-stream'];
export const MAX_FILE_SIZE = 100000000;
export const MAX_FILE_COUNT = 7;

const filesReducer = (
  state:{error?:string;files:HotUploadedFile[]},
  action:{type:string; payload?:(HotUploadedFile[]| string | string[])},
) => {
  switch (action.type) {
    case UPDATE_FILES: {
      if (!action?.payload && !Array.isArray(action.payload)) return state;
      return { ...state, files: [...action.payload as HotUploadedFile[]] };
    }
    case ADD_FILES: {
      if (!action?.payload && !Array.isArray(action.payload)) return state;
      return { ...state, files: [...state.files, ...action.payload as HotUploadedFile[]] };
    }
    case REMOVE_FILE: {
      if (!action?.payload && typeof action.payload === 'string') return state;
      const removeId = action.payload;
      const newFiles = [...state.files];
      const index = newFiles.findIndex((file) => file.id === removeId);
      if (index !== -1) {
        newFiles.splice(index, 1);
      }
      return { ...state, files: [...newFiles] };
    }
    case VALIDATE_FILES: {
      const { files } = state;
      // const { payload } = action;
      // const validFileTypes = [...(payload as string[] ?? [])];
      const errors:string[] = [];
      let totalUploadSize = 0;
      let totalUploadCount = 0;
      files.forEach((file) => {
        if (file.hotFile) {
          totalUploadSize += file.hotFile.size;
          totalUploadCount += 1;
          // if (validFileTypes.indexOf(file.hotFile.type) === -1) {
          //   errors.push('general.errors.invalidFileType');
          // }
        }
      });
      if (totalUploadSize >= MAX_FILE_SIZE) {
        errors.push('general.errors.maxFileSize');
      }

      if (totalUploadCount > MAX_FILE_COUNT) {
        errors.push('general.errors.maxFileCount');
      }
      return { ...state, error: errors[0] };
    }
    case RESET_FILES:
      return { files: [] };
    default:
      return state;
  }
};

export interface FilesHookState {
  files:HotUploadedFile[];
  error?:string;
  addFiles(files:HotUploadedFile[]):void;
  updateFiles(files:HotUploadedFile[]):void;
  removeFile(id:string):void;
  resetFiles():void;
  validateFiles():void;
}

export const useFiles = (validFileTypes?:string[]):FilesHookState => {
  const [state, dispatch] = useReducer(filesReducer, { files: [] });

  const validateFiles = () => {
    dispatch({ type: VALIDATE_FILES, payload: (validFileTypes ?? VALID_FILE_TYPES) });
  };

  const addFiles = (files:HotUploadedFile[]) => {
    dispatch({ type: ADD_FILES, payload: files });
    setTimeout(() => {
      validateFiles();
    }, 7);
  };

  const updateFiles = (files:HotUploadedFile[]) => {
    dispatch({ type: UPDATE_FILES, payload: files });
    setTimeout(() => {
      validateFiles();
    }, 7);
  };

  const removeFile = (id:string) => {
    dispatch({ type: REMOVE_FILE, payload: id });
    setTimeout(() => {
      validateFiles();
    }, 7);
  };

  const resetFiles = () => {
    dispatch({ type: RESET_FILES });
    setTimeout(() => {
      validateFiles();
    }, 7);
  };

  return {
    ...state,
    addFiles,
    updateFiles,
    removeFile,
    resetFiles,
    validateFiles,
  };
};
