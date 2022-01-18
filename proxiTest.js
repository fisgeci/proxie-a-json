let handler = {
    get: (target, property) => {

        console.log((property))
        return target[property];
    },
    set: (target, property, val) => {
        console.log("setting")
        target[property] = val;
    }
}

var jsonData = require('./testData.json');



function makeLoggable(object, parentKey) {
    let loggableObj = {};

    if (object instanceof Array) {
        loggableObj[parentKey] = []
        for (let element of object) {
            loggableObj[parentKey].push(generateProxy(element, parentKey, element));
        }
    } else {
        loggableObj = {};
        for (const key of Object.keys(object)) {
            if (object[key] instanceof Object) {
                loggableObj[key] = generateProxy(object, key, object[key])
            } else {
                loggableObj[key] = object[key];

            }
        }
    }

    return new Proxy(loggableObj, handler);
}

function generateProxy(object, parentKey, value) {
    if (hasObject(value)) {
        return new Proxy(makeLoggable(value, parentKey), handler);
    } else {
        return new Proxy(value, handler);
    }
}

function hasObject(object) {
    let hasObject = false;
    for (const key of Object.keys(object)) {
        if (typeof object[key] == 'object') {
            hasObject = true;
        }
    }
    return hasObject;
}

jsonData = makeLoggable(jsonData, "root");

// console.log((jsonData.root[0].test.test2[0]));
console.log(jsonData.root[1].test);