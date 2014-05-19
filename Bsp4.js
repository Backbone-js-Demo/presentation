(function($){

	//Backbone.sync: Overrides persistence storage with dummy function.
	// This enables use of Model.destroy() without raising an error.
	
	Backbone.sync = function(method, model, success, error){
		success();
	}
	
	//Definition Model
	var Address = Backbone.Model.extend({
		defaults: { 
			part1: 'First Name', //create new variable, default value is 'First Name'
			part2: 'Last Name',  //create new variable, default value is 'Last Name'
		}
	});
	
	//Definition Collection
	var List = Backbone.Collection.extend({ //create new Collection
		model: Address //this Collection consists of Addresses
	});
	
	//Definition View
	var AddressView = Backbone.View.extend({
		tagName: 'li', //select tagName
		
		//define events
		events: {
			'click span.swap':  'swap', //if 'swap' is clicked, the function swap will be executed
			'click span.delete': 'remove' //if 'delete' is clicked, the function delete will be executed
		},    
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'swap', 'remove'); // every function that uses 'this' as the current object should be in here
			
			//bind functions to the model
			this.model.bind('change', this.render); 
			this.model.bind('remove', this.unrender);
		},
		
		render: function(){
			//add new content to the body of the HTML page 
			$(this.el).html('<span style="color:black;">'+this.model.get('part1')+' '+this.model.get('part2')+'</span> &nbsp; &nbsp; <span class="swap" style="font-family:sans-serif; cursor:pointer;">[swap]</span> <span class="delete" style="cursor:pointer; font-family:sans-serif;">[delete]</span>');
			return this; 
		},
		
		unrender: function(){
			//remove rendered content
			$(this.el).remove();
		},
		
		swap: function(){
			//swap contents of variables
			var swapped = {
				part1: this.model.get('part2'),
				part2: this.model.get('part1')
			};
			this.model.set(swapped); //update model
		},
		
		remove: function(){
			this.model.destroy(); //delete this item
		}
	});
	
	//Define a second view
	var ListView = Backbone.View.extend({
		el: $('body'), //define el as the body tag
		
		events: {
			'click button#add': 'addAddress' //if the button is clicked, 'addAddress' will be executed
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'addAddress', 'appendAddress'); // every function that uses 'this' as the current object should be in here
			
			this.collection = new List(); //create a new list
			this.collection.bind('add', this.appendAddress); // collection event binder
			
			this.counter = 0; //set counter to 0
			this.render(); //render View
		},
		
		render: function(){
			var self = this;
			$(this.el).append('<input type="text" name="firstname"/>'); //create a new input field for the first name
			$(this.el).append('<input type="text" name="lastname"/>'); //create a new input field for the last name
			
			$(this.el).append("<p>First Name Last Name</p>");  
			$(this.el).append("<button id='add'>Add address</button>"); //create the 'Add address' button
			
			$(this.el).append('<ol></ol>'); //create numbered list
			_(this.collection.models).each(function(address){ // in case collection is not empty
				self.appendAddress(address);
			}, this);
		},
		
		addAddress: function(){
			this.counter++; //increase counter
			var address = new Address(); //create new address
			address.set({
				part1: $(this.el).find('input[name=firstname]').val() //set part1 to the content of the first name input field
			});
			address.set({
				part2: $(this.el).find('input[name=lastname]').val() //set part2 to the contet of the last name input field
			});
			this.collection.add(address); //add address to the collection
		},
		
		appendAddress: function(address){
			var addressView = new AddressView({ //create a new view
				model: address //model for this view will be address
			});
			$('ol', this.el).append(addressView.render().el); //Append the results of the render funtion to the numberd list
		}
	});
	
	var listView = new ListView(); //call ListView
})(jQuery);
