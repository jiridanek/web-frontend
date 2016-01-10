import DS from "ember-data";
import Ember from "ember";

export default DS.Model.extend({
	title: DS.attr("string"),
	author: DS.belongsTo("user", { async: true }),

	git_branch: DS.attr("string"),
	git_commit: DS.attr("string"),
	git_path: DS.attr("string"),

	deploy_date: DS.attr("date"),
	deploy_status: DS.attr("string"),

	wave: DS.belongsTo("wave", { async: true }),

	deploy_status_default: Ember.computed("deploy_status", function() { return this.get("deploy_status") === "default"; }),
	deploy_status_deploying: Ember.computed("deploy_status", function() { return this.get("deploy_status") === "deploying"; }),
	deploy_status_done: Ember.computed("deploy_status", function() { return this.get("deploy_status") === "done"; }),
	deploy_status_error: Ember.computed("deploy_status", function() { return this.get("deploy_status") === "error"; }),
	deploy_status_diff: Ember.computed("deploy_status", function() { return this.get("deploy_status") === "diff"; }),
});