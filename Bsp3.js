(function($){

	//Definition of the model
	var Item = Backbone.Model.extend({
		defaults: {
			part1: 'First Name', //create new variable, set default value to 'First Name'
			part2: 'Last Name' //create new variable, set default value to 'Last Name'
		}
	});
	
	//Definition Collection (List of instances of a given model
	var List = Backbone.Collection.extend({
		model: Item //Collection is made of Items
	});
	
	//Definition View
	var ListView = Backbone.View.extend({
		el: $('body'), //define el as the HTML body tag
		
		//Define events and what should happen
		events: {
			'click button#add': 'addAddress' //if the button is clicked, the function 'addAddress' is called
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'addAddress', 'appendAddress'); // bind all functions
			this.collection = new List(); // create new List to use
			this.collection.bind('add', this.appendAddress); // collection event binder
			
			this.counter = 0; //set counter to 0
			this.render(); // render page
		},
		
		render: function(){
			var self = this;
			$(this.el).append("<button id='add'>Add address</button>"); //add button to the page
			$(this.el).append("<ul></ul>"); //add a list to the page
			_(this.collection.models).each(function(item){ // in case collection is not empty
				self.appendAddress(item);
			}, this);
		},
		
		addAddress: function(){
			this.counter++; //increase counter
			var item = new Item(); //create a new Item
			item.set({
				part2: item.get('part2') + this.counter // modify item defaults, set part2 to 'part2'+current counter value
			});
			this.collection.add(item); // add item to collection; view is updated via event 'add'
		},
		
		appendAddress: function(item){
			$('ul', this.el).append("<li>"+item.get('part1')+" "+item.get('part2')+"</li>"); //append new item to the list
		}
	});
	
	var listView = new ListView(); //call ListView
})(jQuery);
