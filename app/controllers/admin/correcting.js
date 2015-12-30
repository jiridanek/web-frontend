import Ember from "ember";
import config from '../../config/environment';

export default Ember.Controller.extend({
	store: Ember.inject.service(),
	session: Ember.inject.service(),
	participant: "",
	task: "",
	queryParams: ["participant_", "task_"],
	waves: Ember.computed("model", function() {
		var set = new Set();
		this.get("model").forEach(function(element) {
			set.add(element.get("wave"));
		}, this);
		return Array.from(set).sort(function(a, b) {
			if(a.get("id") < b.get("id")) { return -1; }
			if(a.get("id") > b.get("id")) { return 1; }
			return 0;
		});
	}),
	tasks: Ember.computed("wave", function() {
		var e = this.get("wave");
		if (!this.get("wave")) {
			this.set("task", "");
		}
		return this.get("model").filter(function(elem) {
			return elem.get("wave.id") === e;
		});
	}),
	participants: Ember.computed("task", "model", "wave", function() {
		var self = this;
		var set = new Set();
		this.get("model").forEach(function(element) {
			if (!self.get("task") || element.get("id") === self.get("task")) {
				element.get("solvers").forEach(function(e) {
					//if (!e.get("organisator")) {
						set.add(e);
					//}
				});
			}
		});
		return Array.from(set).sort(function(a, b) {
			if(a.get("last_name") < b.get("last_name")) {
				return -1;
			}
			if (a.get("first_name") < b.get("first_name")) {
				return -1;
			}
			return 0;
		});
	}),
	corrections_filtered: Ember.computed("corrections", "state", function() {
		var val = this.get("state");
		if (val === "all") {
			return this.get("corrections");
		}
		return this.get("corrections").filter(function(p) {
			return p.get("state") === val;
		}).sort(function(a, b) {
			if (a.get("user.last_name") < b.get("user.last_name")) { return -1; }
			if (a.get("user.last_name") > b.get("user.last_name")) { return 1; }
			return 0;
		});
	}),
	is_fully_corrected: Ember.computed("corrections", function() {
		return 0 === this.get("corrections").filter(function(p) {
			return p.get("state") === "notcorrected";
		}).length;
	}),
	set_filter_warning: function() {
		if (this.get("participant") === "" && this.get("task") === "") {
			this.set("wrong-filter", true);
			return true;
		}
		this.set("wrong-filter", false);
		return false;
	},
	load_corrections: function() {
		if (this.set_filter_warning()) {
			return;
		}
		this.set("filter_in_progress", true);
		var params = {};
		if (this.get("task") !== "") {
			params["task"] = this.get("task");
		}
		if(this.get("participant") !== "") {
			params["participant"] = this.get("participant");
		}
		if(this.get("state") !== "") {
			params["state"] = this.get("state");
		}
		var self = this;
    this.get("store").unloadAll("correction");
		this.get("store").find("correction", params).then(function(p) {
			self.set("corrections", p);
			self.set("publish_done", "");
			self.set("filter_in_progress", false);
		}, function() {
			self.set("filter_in_progress", false);
			alert("Nepodařilo se načíst data ze serveru!");
		});
		
	},
	paramsObserver: function() {
		var p = this.get("participant_");
		var t = this.get("task_");
		if (p) {
			this.set("participant", p);
		}
		if(t) {
			this.set("task", t);
		}
		if (p || t) {
			this.load_corrections();
		}
	}.observes("participant_", "task_"),
  is_task_selected: Ember.computed("task", "task_", function() {
    return this.get("task") || this.get("task_");
  }),
	actions: {
		publish: function() {
			if(!confirm("Opravdu zveřejnit?")) {
				return;
			}
			var self = this;
			this.get('session').authorize('authorizer:oauth2', function(header, h) {
                    Ember.$.ajax({
                        url: config.API_LOC + "/admin/corrections/" + self.get("task") + "/publish?public=true",
                        type: 'GET',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader(header, h);
                        },
                        success: function() {
                            self.set("publish_done", "Publikováno");
                        },
                        error: function() {
                            self.set("publish_done", "Špatná odpověď ze serveru. Zkus to za chvíli znovu.");
                        }
                    });
			});
		},
		task_select: function() {
			var t = this.get("task");
			this.set("task", Ember.$("#task_sel").val());
			if(t !== this.get("task")) {
				this.set_filter_warning();
			}
		},
		participant_select: function() {
			var p = this.get("participant");
			this.set("participant", Ember.$("#par_sel").val());
			if (p !== this.get("participant")) {
				this.set_filter_warning();
			}
		},
		filter: function() {
			this.load_corrections();
		},
		all: function() {
            var self = this;
            this.get('session').authorize('authorizer:oauth2', function(header, content) {
				var id;
				if (self.get("task")) {
					id = self.get("task");
				} else {
					id = self.get("task_");
				}
                var request = new XMLHttpRequest();
                request.open("GET", config.API_LOC + "/admin/subm/task/" + id, true);
                request.responseType = "blob";
                request.setRequestHeader(header, content);
                request.onload = function() {
                    if (this.status === 200) {
                        var file = window.URL.createObjectURL(this.response);
                        var a = document.createElement("a");
                        a.href = file;
                        a.download = this.response.name || ("opravy_uloha" + self.get("task") + ".zip");
                        document.body.appendChild(a);
                        a.click();
                        window.onfocus = function() {
                            document.body.removeChild(a);
                        };
                    }
                };
                request.send();
            });
        },
	}
});
