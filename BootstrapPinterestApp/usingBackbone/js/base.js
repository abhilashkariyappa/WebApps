(function(){ 

    window.App = {   // defining app name space, You can rename it as per your project name..
        Models: {},
        Collections: {},
        Views: {}
    };

    window.template = function(id){
        return _.template( $('#'+id).html());
    };

    // Recipe Model
    App.Models.Recipe = Backbone.Model.extend();

    // Same here. People is referencing now collection from App namespace
    App.Collections.Recipes = Backbone.Collection.extend({ 
        model: App.Models.Recipe, // Change here for Person Reference from App models namespace
        url: 'data/recipes.json',
        parse: function(response) {
            return response;
        }
    });

    //Recipes List View 
    App.Views.RecipesList = Backbone.View.extend({
        el: $("#content"),
        initialize: function(){
            this.collection.bind("reset", this.render, this);
            this.collection.bind("change", this.render, this);
            this.collection.fetch();
        },

        // refactored render method...  
        render: function(){
            this.collection.each(function(recipe){
                var recipeSingleView = new App.Views.SingleRecipe({ model: recipe });
                this.$el.append(recipeSingleView.render().el); 
            }, this);
            init_masonry(); //add the pinterest layout
            return this;
        },

    });

    App.Views.SingleRecipe = Backbone.View.extend({
        template : template('recipeTemplate'),
        render: function(){
            //console.log(this.model.toJSON());
            this.$el.html( this.template(this.model.toJSON()));
            return this;  // returning this from render method..
        }   
    });


    var recipeApp = new App.Views.RecipesList({collection : new App.Collections.Recipes()});
    $("#loading").remove();
    
    
    function init_masonry(){
        var $container = $('#content');
        $container.imagesLoaded( function(){
            $container.masonry({
                itemSelector : '.box'
            });
        });
    }

})();