// A demo app built with our framework

// Front.route('/', function() {
//   $("#content").html($('#template-index').html())
// })

// Front.route('/hi', function() {
//   var html = $('#template-page').html()
//   var compiled = Handlebars.compile(html)
//   $("#content").html(compiled({ title: 'Hi' }))
// })

new Front.Controller({
  '/': function() {
    this.render('index')
  },
  '/hi': function() {
    this.render('page', { title: 'Hi' })
  }
})

Front.start()