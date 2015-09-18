import DS from "ember-data";
import Ember from "ember";

export default DS.Model.extend( {
	type: DS.attr("string"),
	is_quiz: Ember.computed("type", function() {
		return this.get("type") === "quiz";
	}),
	is_programming: Ember.computed("type", function() {
		return this.get("type") === "programming";
	}),
	is_general: Ember.computed("type", function() {
		return this.get("type") === "general";
	}),
	is_text: Ember.computed("type", function() {
		return this.get("type") === "text";
	}),
	is_sortable: Ember.computed("type", function() {
		return this.get("type") === "sortable";
	}),

	endpoint: DS.attr("string"),
	description: DS.attr("string"),

	// For sortable
	sortable_list: DS.attr("sortable-list"),

	// For quiz

	// For code
	code: DS.attr("string")
});
