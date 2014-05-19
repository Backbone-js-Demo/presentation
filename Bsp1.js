(function($){

	//Definition View
	//this example does not define any other models, so the M in MVC
	//is not visible
	var ListView = Backbone.View.extend({
		el: $('body'), 
		
		initialize: function(){  //initialize View
		_.bindAll(this, 'render'); //bind everything rendered to the body
		
		this.render(); //render View
		},
	
		render: function(){
	      		$(this.el).append("<h1>Hello Backbone.js!</h1>"); //append 'Hello Backbone.js to the body of the HTML page
		}
	});
	
	var listView = new ListView(); //run View
})(jQuery);
