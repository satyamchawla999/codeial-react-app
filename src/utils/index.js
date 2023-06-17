export * from './constants' ;

export const setItemInLocalStorage = (key,value) => {
    if(!key || !value) {
        return console.error('Can not store in LS');
    }

    const valueToStore = typeof value != 'string' ? JSON.stringify(value) : value;

    localStorage.setItem(key,valueToStore);
};

export const getItemFromLocalStorage = (key) => {
    if(!key ) {
        return console.error("Can't get the value from LS");
    }

    return localStorage.getItem(key);
};

export const removeItemFromLocalStorage = (key) => {
    if(!key) {
        return console.error("Can't get the value from LS");
    }

    localStorage.removeItem(key);
};


export const getFormBody = (params) => {
    let formBody = [];

    for(let property in params) {
        let encodeKey = encodeURIComponent(property); // 'user name' => 'user%20name'
        let encodeValue = encodeURIComponent(params[property]); // 'satyam 123' => 'satyam%20123'

        formBody.push(encodeKey+'='+encodeValue);
    }

    return formBody.join('&'); // username=satyam&password=123123'
}
