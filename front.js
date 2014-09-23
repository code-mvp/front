// Front - Our own frontend framework
Front = {}

// Detect if pushState is available. Fallback to hashchange.
Front.hasPushState = !!(window.history && window.history.pushState)

Front.navigate = function(path) {
  if (Front.hasPushState) {
    window.history.pushState({}, "ignored", path)    
  } else {
    window.location.hash = '#' + path    
  }
  Front.load()
}

Front.start = function() {
  if (Front.hasPushState) {
    $(window).on('popstate', Front.load)
  } else {
    $(window).on('hashchange', Front.load)    
  }

  // Intercept link clicks
  $(document).on('click', 'a', function() {
    Front.navigate($(this).attr('href'))
    return false
  })

  // Execute the route for the current location
  Front.load()
}

Front.routes = []

Front.route = function(path, callback) {
  this.routes.unshift({ path: path, callback: callback })
}

Front.load = function() {
  if (Front.hasPushState) {
    var url = window.location.pathname    
  } else {
    var url = window.location.hash.slice(1) || "/"    
  }

  for (var i = 0; i < Front.routes.length; i++) {
    var route = Front.routes[i]

    if (route.path === url) {
      route.callback()
      return
    }
  }
}


// A nicer API

Front.Controller = function(routes) {
  var self = this
  Object.keys(routes).forEach(function(path) {
    var callback = routes[path]
    // Bind the callback function to the current controller.
    Front.route(path, function() { callback.call(self) })      
  })
}

Front.Controller.prototype.render = function(template, data) {
  var html = $('#template-' + template).html()
  // TODO cache this! We don't want to compile the template each time.
  var compiled = Handlebars.compile(html)

  $("#content").html(compiled(data))
}
