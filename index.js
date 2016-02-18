var document = document || require("./dom.js").document

function parseSelector(string) {
  var attrArray = string.split(/([\.#]?[^\s#.]+)/)
  // removes the spaces
  attrArray = attrArray.filter(Boolean)
  var el;
  var classString = '';
  var idString = '';

  if (/^\.|#/.test(attrArray[0])) {
    el = 'div'
  } else {
    el = attrArray[0]
    attrArray = attrArray.splice(1)
  }

  attrArray.forEach(function(v) {
    var s = v.slice(1);

    if (v[0] === '.') {
      // e.classList.add(s);
      classString += " " + s
    } else if (v[0] === '#') {
      // e.id = s;
      idString += " " + s
    }
  })

  idString = idString.trim()
  classString = classString.trim()
  return {
    el: el,
    id: idString,
    class: classString
  }
}

function createDOMElement(string) {
  var attrObject = parseSelector(string);
  var el;

  el = document.createElement(attrObject.el);

  el.className = attrObject.class;
  el.id = attrObject.id;

  return el;
}

function isNode(el) {
  if (el !== undefined && el.nodeName !== undefined && el.nodeType !== undefined) {
    return true;
  } else {
    return false
  }
}

function areNodes(elArray) {
  elArray.forEach(function(el) {
    if (el !== undefined && el.nodeName !== undefined && el.nodeType !== undefined) {
      return false
    }
  });
  return true;
}

// returns an array of function that we use later to remove the events attached
function applyAttributes(el, attrObject) {
  var e = el;
  var l = attrObject;
  // This is where we store all our event listeners after attached, so we can easily clean them up later
  var cleanupFuncs = []

  for (var attrName in attrObject) {
    var attrValue = attrObject[attrName];
    if(typeof attrValue === 'function') {
      // check if it starts with 'on'
      var isEventHandler = /^on\w+/.test(attrName);

      if(isEventHandler) {
        // remove the 'on'
        var eventName = attrName.slice(2);
        (function (attrName, attrObject) { // capture k, l in the closure
          if (e.addEventListener){
            e.addEventListener(eventName, attrValue, false)
            cleanupFuncs.push(function(){
              e.removeEventListener(eventName, attrValue, false)
            })
          } else {
            e.attachEvent(attrName, attrValue)
            cleanupFuncs.push(function(){
              e.detachEvent(attrName, attrValue)
            })
          }
        })(attrName, attrObject)
      } else {
        // observable
        e[attrName] = attrObject[attrName]()
        cleanupFuncs.push(attrObject[attrName](function (v) {
          e[attrName] = v
        }))
      }
    }
    else if(attrName === 'style') {
      if('string' === typeof attrObject[attrName]) {
        e.style.cssText = attrObject[attrName]
      }else{
        for (var style in attrObject[attrName]){
          (function(s, v) {
            if('function' === typeof v) {
              // observable
              e.style.setProperty(style, v())
              cleanupFuncs.push(v(function (val) {
                e.style.setProperty(style, val)
              }))
            } else
              e.style.setProperty(style, attrObject[attrName][style])
          })(style, attrObject[attrName][style])
        }
      }
    } else if (attrName.substr(0, 5) === "data-") {
      e.setAttribute(attrName, attrObject[attrName])
    } else {
      e[attrName] = attrObject[attrName]
    }
  }
  return cleanupFuncs;
}

function h(selector, properties, children) {
  var childNodes = []
  if (children === undefined && properties !== undefined && areNodes(properties)) {
    childNodes = properties;
  } else if (children !== undefined){
    childNodes = children;
  }
  var el = null;
  if (el === null) {
    el = createDOMElement(selector);
  } else {
    el.appendChild(createDOMElement(selector));
  }
  childNodes.forEach(function(childNode){
    el.appendChild(childNode);
  })
  applyAttributes(el, properties);
  return el;
}

function render(elToAdd, baseEl){
  baseEl.appendChild(elToAdd);
}

module.exports = h
