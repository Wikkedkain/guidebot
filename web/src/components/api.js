import { localCache } from './stores.js';


// TODO: create a cached API service object on demand by passing in the path variable

async function fetchData(path) {
    let response = await fetch(path);
    let data = await response.json();
    return data;
}

export const cachedApi = function(path, onError, isCached = true) {
    let dataCache = localCache(path);
    let data = dataCache.get();

    return async function() {
        if(!isCached || data == null) {
            let response = await fetchData(path);
            if(response.status == 'error') return onError(response);

            data = response;
            if(isCached) dataCache.set(data);
        }
        return data;
    }
}