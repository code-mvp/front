Front = {}

Front.navigate = function(path) {
  window.history.pushState({}, "", path)
  Front.load()
}

Front.start = function() {
  $(window).on('popstate', Front.load)

  Front.load()
}

Front.load = function() {
  var url = location.pathname
  
  for (var i = 0; i < Front.routes.length; i++) {
    var route = Front.routes[i]
    var matches = url.match(route.regexp)

    if (matches) {
      route.callback.apply(null, matches.slice(1)) // callback("permalink")
      return
    }
  }
}

Front.routes = []

Front.route = function(path, callback) {
  path = path.replace(/:\w+/g, '([^/?]+)') // :permalink => ([^/?]+)
  var regexp = new RegExp("^" + path + "$")

  Front.routes.push({
    regexp: regexp,
    callback: callback
  })
}