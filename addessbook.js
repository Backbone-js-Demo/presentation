
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Address Model
  // ----------
  var Address = Backbone.Model.extend({

    // Default attributes for the address item.
    defaults: function() {
      return {
        first_name: "empty first name...",
		last_name: "empty last name...",
		email: "empty email address...",
        order: Addresses.nextOrder(),
        done: false
      };
    },

    // Toggle the `done` state of this address item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

  // Address Collection
  // ---------------

  // The collection of addresses is backed by *localStorage* instead of a remote
  // server.
  var AddressList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Address,

    // Save all of the addresses items under the `"addresses-backbone"` namespace.
    localStorage: new Backbone.LocalStorage("addresses-backbone"),

    // Filter down the list of all addresses items that are to be deleted.
    done: function() {
      return this.where({done: true});
    },

    // Filter down the list to only addresses items that are not to be deleted.
    remaining: function() {
      return this.where({done: false});
    },

    // We keep the Addresses in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Addresses are sorted by their original insertion order.
    comparator: 'order'

  });

  // Create our global collection of **Addresses**.
  var Addresses = new AddressList;

  // Address Item View
  // --------------

  // The DOM element for a addess item...
  var AddressView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    // The AddressView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Address** and a **AddressView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the first_names of the address item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the address.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({first_name: value});
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#addressapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      //"keypress #new-first_name":  "createOnEnter",
	  "keypress #new-email":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Addresses`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting addresss that might be saved in *localStorage*.
    initialize: function() {

	  this.input = this.$("#new-first_name");
      this.input_last_name = this.$("#new-last_name");
	  this.input_email = this.$("#new-email");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Addresses, 'add', this.addOne);
      this.listenTo(Addresses, 'reset', this.addAll);
      this.listenTo(Addresses, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Addresses.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Addresses.done().length;
      var remaining = Addresses.remaining().length;

      if (Addresses.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single address item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(address) {
      var view = new AddressView({model: address});
      this.$("#address-list").append(view.render().el);
    },

    // Add all items in the **Addresses** collection at once.
    addAll: function() {
      Addresses.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Address** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
	
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;
      if (!this.input_last_name.val()) return;
      if (!this.input_email.val()) return;
	  

      Addresses.create({first_name: this.input.val(),
						last_name: this.input_last_name.val(),
						email: this.input_email.val()
				});
      this.input.val('');
	  this.input_last_name.val('');
	  this.input_email.val('');
    },

    // Clear all done address items, destroying their models.
    clearCompleted: function() {
      _.invoke(Addresses.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Addresses.each(function (address) { address.save({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
