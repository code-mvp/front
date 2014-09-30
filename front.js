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
      route.callback.apply(route.context, matches.slice(1)) // callback("permalink")
      return
    }
  }
}

Front.routes = []

Front.route = function(path, callback, context) {
  path = path.replace(/:\w+/g, '([^/?]+)') // :permalink => ([^/?]+)
  var regexp = new RegExp("^" + path + "$")

  Front.routes.push({
    regexp: regexp,
    callback: callback,
    context: context
  })
}

Front.Router = function(routes) {
  for (var path in routes) {
    var callback = routes[path]

    Front.route(path, callback, this)
  }
}

Front.Router.prototype.render = function(template, data) {
  var html = $("[data-template-name='" + template + "']").html()
  // TODO cache compiledTemplate
  var compiledTemplate = Handlebars.compile(html)
  $("#content").html(compiledTemplate(data))  
}
