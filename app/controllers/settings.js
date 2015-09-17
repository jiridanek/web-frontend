import Ember from "ember";

export default Ember.Controller.extend( {
    countries: ["Česká republika", "Slovensko"],
    tshirt_size: ["S", "M", "L", "XL"],
    maturita_year: ["2016", "2017", "2018", "2019"],
    is_changing_picture: false,
    picture_error: undefined,
    picture_info: undefined,
    global_error: undefined,
    global_info: undefined,
    actions: {
    	upload_pic: function() {
    		if(this.get("is_changing_picture")) {
    			this.get("picture_field").send("make_upload");
    			this.set("picture_info", "Obrázek se nahrává");
    		}
    		else {
    			this.set("is_changing_picture", true);
    			this.set("picture_error", undefined);
    			this.set("picture_info", undefined);
    		}
    	},
    	file_type_error: function(filename) {
    		console.log("Invalid file captured");
    		this.set("picture_error", "Nepodporovaný typ souboru: " + filename);
    	},
    	upload_finished: function() {
    		// ToDo: Reload picture!
    		this.set("is_changing_picture", false);
    	},
    	upload_failed: function(status, error) {
    		this.set("picture_info", undefined);
    		this.set("picture_error", "Nepodařilo se nahrát obrázek: " + status + " " + error);
    	},
    	save: function() {
    		this.set("global_info", undefined);
    		this.set("global_error", undefined);
    		this.get("model").save().then(function() {
    			this.set("global_info", "Nastavení úspěšně uloženo");
    			Ember.run.later((function() {
    				self.set("global_info", undefined);
    			}), 3000);
    		},
    		function() {
    			this.set("global_error", "Nepodařilo se uložit nastavení. Zkuste to za chvíli znovu");
    		})
    	}
    }
});
