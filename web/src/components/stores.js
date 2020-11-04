import { writable } from 'svelte/store';

export const commandStore = writable([]);

export const cookies = (function() {
    function getCookies() {
        let entries = document.cookie.split(';').map((e) => e.trim());
        return entries.reduce((result, entry) => {
            let parts = entry.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
    }

    return {
        get: function(name) {
            let cookieMap = getCookies();
            return cookieMap[name];
        }
    }
})();

export const localCache = function(key) {
    function dateDiffDays(fromDate, toDate) {
        return Math.floor((toDate - fromDate) / (1000*60*60*24));
    }

    function isCacheExpired(cache) {
        if(cache == null || cache.date == undefined) return false;
        return dateDiffDays(cache.date, new Date()) >= cache.maxAge;
    }

    return {
        set: function(data, maxAge) {
            if (typeof(localStorage) != 'undefined') {
                if(maxAge == undefined || maxAge < 1) maxAge = 1;
                localStorage.setItem(key, JSON.stringify({data:data,date:new Date(),maxAge:+maxAge}));
            }
        },
        get: function() {
            if (typeof(localStorage) != 'undefined') {
                let cache = JSON.parse(localStorage.getItem(key) || '{}');
                if(isCacheExpired(cache)) {
                    localStorage.setItem(key, null);
                    return null;
                }
                return cache.data;
            }
        }
    };
};