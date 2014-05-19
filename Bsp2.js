(function($){

	//Definition View
	//no other models defined
  var ListView = Backbone.View.extend({
	
    el: $('body'), 
	
	//Define Events and what should be done
    events: {
      'click button#add': 'addAddress'
    },
	
    initialize: function(){
      _.bindAll(this, 'render', 'addAddress');

      this.counter = 0; 
      this.render();
    },
    render: function(){
      $(this.el).append("<button id='add'>Add new address</button>");
      $(this.el).append("<p></p>");
    },
    addAddress: function(){
      this.counter++;
      $('p', this.el).append("Address no."+this.counter+"<br>");
    }
  });

  var listView = new ListView();
})(jQuery);
