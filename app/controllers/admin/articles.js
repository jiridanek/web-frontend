import Ember from "ember";

export default Ember.Controller.extend( {
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    sortProperties:  [ "time_published:desc" ],

    articles: Ember.computed.sort("model", "sortProperties"),

    actions: {
        'article-delete': function(article) {
            if(!confirm("Opravdu odstranit článek " + article.get("title") + "?")) {
                return;
            }

             article.set("deleting", true);
             article.destroyRecord(); // DELETE to /admin/atask/1
        },
    },
});
