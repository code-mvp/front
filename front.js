Front = {}

Front.usePushState = !!(window.history && window.history.pushState)

// Uncomment to force use of hashchange.
// Front.usePushState = false

Front.navigate = function(path) {
  if (Front.usePushState) {
    window.history.pushState({}, "", path)
  } else {
    path = path.replace(/(\/\/|[^\/])*/, "") // If the URL is absolute, make it relative
    window.location.hash = '#' + path
  }
  Front.load()
}

Front.start = function() {
  if (Front.usePushState) {
    $(window).on('popstate', Front.load)    
  } else {
    $(window).on('hashchange', Front.load)
  }

  Front.load()
}

Front.load = function() {
  if (Front.usePushState) {
    var url = location.pathname
  } else {
    var url = location.hash.slice(1) || "/"
  }
  
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