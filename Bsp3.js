(function($){

  //Definition of the model
  var Item = Backbone.Model.extend({
    defaults: {
      part1: 'First Name',
      part2: 'Last Name'
    }
  });
  
  //Definition Collection (List of instances of a given model
  var List = Backbone.Collection.extend({
    model: Item
  });

  //Definition View
  var ListView = Backbone.View.extend({
    el: $('body'),
	
	//Define events and what should happen
    events: {
      'click button#add': 'addAddress'
    },

    initialize: function(){
      _.bindAll(this, 'render', 'addAddress', 'appendAddress'); // remember: every function that uses 'this' as the current object should be in here

      this.collection = new List();
      this.collection.bind('add', this.appendAddress); // collection event binder

      this.counter = 0;
      this.render();
    },
	
    render: function(){
      var self = this;
      $(this.el).append("<button id='add'>Add address</button>");
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendAddress(item);
      }, this);
    },

    addAddress: function(){
      this.counter++;
      var item = new Item();
      item.set({
        part2: item.get('part2') + this.counter // modify item defaults
      });
      this.collection.add(item); // add item to collection; view is updated via event 'add'
    },

    appendAddress: function(item){
      $('ul', this.el).append("<li>"+item.get('part1')+" "+item.get('part2')+"</li>");
    }
  });

  var listView = new ListView();
})(jQuery);
