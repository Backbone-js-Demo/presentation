(function($){

  //Definition View
  //this example does not define any other models, so the M in MVC
  //is not visible
  var ListView = Backbone.View.extend({
    el: $('body'), 

	initialize: function(){
      _.bindAll(this, 'render'); 

       this.render(); 
    },

	render: function(){
      $(this.el).append("<h1>Hello Backbone.js!</h1>");
    }
  });

  var listView = new ListView();
})(jQuery);
