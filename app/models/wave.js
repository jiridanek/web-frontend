import DS from "ember-data";
import Ember from "ember";

export default DS.Model.extend( {
	'caption': DS.attr("string"),
	'garant': DS.belongsTo("user", { async: true }),
	'public': DS.attr("boolean"),
	'time_published': DS.attr("date"),
	'year': DS.attr("number"),
	'index': DS.attr("number"),

	'published': Ember.computed("time_published", function() {
		return this.get("time_published") < new Date();
	})
});
