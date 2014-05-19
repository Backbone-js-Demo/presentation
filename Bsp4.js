(function($){

//Backbone.sync: Overrides persistence storage with dummy function.
// This enables use of Model.destroy() without raising an error.
	
  Backbone.sync = function(method, model, success, error){
    success();
  }

  //Definition Model
  var Address = Backbone.Model.extend({
    defaults: {
      part1: 'First Name',
      part2: 'Last Name', 
    }
  });

  //Definition Collection
  var List = Backbone.Collection.extend({
    model: Address
  });

  //Definition View
  var AddressView = Backbone.View.extend({
    tagName: 'li',

	//define events
    events: {
      'click span.swap':  'swap',
      'click span.delete': 'remove'
    },    

    initialize: function(){
      _.bindAll(this, 'render', 'unrender', 'swap', 'remove'); // every function that uses 'this' as the current object should be in here

      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
    },

    render: function(){
      $(this.el).html('<span style="color:black;">'+this.model.get('part1')+' '+this.model.get('part2')+'</span> &nbsp; &nbsp; <span class="swap" style="font-family:sans-serif; cursor:pointer;">[swap]</span> <span class="delete" style="cursor:pointer; font-family:sans-serif;">[delete]</span>');
      return this; 
    },

    unrender: function(){
      $(this.el).remove();
    },
	
    swap: function(){
      var swapped = {
        part1: this.model.get('part2'),
        part2: this.model.get('part1')
      };
      this.model.set(swapped);
    },

    remove: function(){
      this.model.destroy();
    }
  });
  
  //Define a second view
  var ListView = Backbone.View.extend({
    el: $('body'),
    events: {
      'click button#add': 'addAddress'
    },
    initialize: function(){
      _.bindAll(this, 'render', 'addAddress', 'appendAddress'); // every function that uses 'this' as the current object should be in here

      this.collection = new List();
      this.collection.bind('add', this.appendAddress); // collection event binder

      this.counter = 0;
      this.render();
    },
    render: function(){
      var self = this;
	  $(this.el).append('<input type="text" name="firstname"/>');
	  $(this.el).append('<input type="text" name="lastname"/>');
	  
      $(this.el).append("<button id='add'>Add address</button>"); 
	  
	  $(this.el).append("<p>First Name Last Name</p>");  
      $(this.el).append('<ol></ol>');
      _(this.collection.models).each(function(address){ // in case collection is not empty
        self.appendAddress(address);
      }, this);
    },
    addAddress: function(){
      this.counter++;
      var address = new Address();
	  address.set({
		part1: $(this.el).find('input[name=firstname]').val()
	  });
      address.set({
        part2: $(this.el).find('input[name=lastname]').val()
      });

      this.collection.add(address);
    },
    appendAddress: function(address){
      var addressView = new AddressView({
        model: address
      });
      $('ol', this.el).append(addressView.render().el);
    }
  });

  var listView = new ListView();
})(jQuery);
