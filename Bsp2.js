(function($){

	//Definition View
	//no other models defined
	var ListView = Backbone.View.extend({
	
		el: $('body'), //define that el is the body tag in the HTML page
		
		//Define Events and what should be done
		events: {
			'click button#add': 'addAddress' //if the button is pressed, the function 'addAddress' will be executed
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'addAddress'); //bind all functions
		
			this.counter = 0; //initialize counter
			this.render(); //render view
		},
		
		render: function(){
			$(this.el).append("<button id='add'>Add new address</button>"); //create new button
			$(this.el).append("<p></p>"); //add new paragraph
		},
		
		addAddress: function(){
			this.counter++; //increase counter by one
			$('p', this.el).append("Address no."+this.counter+"<br>"); //append 'Line no.' and the current line number to the view
		}
	});
	
	var listView = new ListView(); //call ListView
})(jQuery);
