function createDom(type, attrs, childrenVarArgs) {
    var el = createElement(type);

    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];

      if (typeof child === 'string') {
        el.appendChild(createTextNode(child));
      } else {
        if (child) {
          el.appendChild(child);
        }
      }
    }

    for (var attr in attrs) {
      if (attr == 'className') {
        el[attr] = attrs[attr];
      } else {
        el.setAttribute(attr, attrs[attr]);
      }
    }

    return el;
  }