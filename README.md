#Presentation: Backbone.js
====================

##DESCRIPTION
This presentation was created as a student project for the the 2014 Plattforms & Frameworks class at the DHBW Mannheim.  
This presentation was created to serve as a short introduction into the javascript framework  [Backbone.js](http://backbonejs.org/). It consists of a general summary of the purpose and features of Backbone.js and a small example of how Backbone.js can be used.
To show how a Backbone.js application works and how to build one, this presentation includes four simple example applications. The examples show the build of a simple addressbook and build on top of each other. Yet they can be run independantly from each other.

##How to build a Backbone.js webpage
Backbone.js uses the [MVC-Pattern](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) to build webpages. 
This means, that you can define your own models in Javascript and display them using custom views as you define them in your code.

First you have to build your basic HTML page and include jquery.js, underscore.js and backbone.js in order to work with Backbone.js.

After that, you can start creating your application. A basic example how that works can be seen in [Example 1](https://raw.githubusercontent.com/Backbone-js-Demo/presentation/master/Bsp1.js).
Basically you start by creating the models you are going to use:

```
  var Item = Backbone.Model.extend({
    defaults: {
      part1: 'Part 1',
    }
  });
```
This code creates a model called 'Item' which is build out of one variable called 'part1' with a default value of 'Part 1'.

You can create lists of model instances by creating a collection:
```  
	var List = Backbone.Collection.extend({
    model: Item
  });
```

To display any content other than what you have created in your HTML page, you have to create a view to display it.
```
(function($){
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
      $(this.el).append("<button id='add'>Add line</button>");
      $(this.el).append("<p></p>");
    },
    addAddress: function(){
      this.counter++;
      $('p', this.el).append("Line no."+this.counter+"<br>");
    }
  });

  var listView = new ListView();
})(jQuery);
```

You can expand your application as you like.


##LICENSE
This presentation is licensed under the german ported Creative Commons Attribution Non-Commercial Share-alike License (CC BY-NC-SA 3.0 DE). This license can be found under: http://creativecommons.org/licenses/by-nc-sa/3.0/de/legalcode.
The full length license can be found in the license.md file.

