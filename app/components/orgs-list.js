import Ember from 'ember';

export default Ember.Component.extend({
    tagName: "",
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, function(){
            $(window).load(function(){
                $('.hcaption').hcaptions();
            });
        });
    }
});
