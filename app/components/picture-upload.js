import EmberUploader from "ember-uploader";
import Ember from "ember";
import InboundActions from "ember-component-inbound-actions/inbound-actions";
import config from '../config/environment';

export default EmberUploader.FileField.extend(InboundActions, {
    session: Ember.inject.service(),

    url: config["API_LOC"] + "/profile/picture",
    supported_ext: ["jpg", "jpeg", "png", "gif"],
    classNames: ["hide"],
    attributeBindings: ["multiple", "accept"],
    accept: function() {
        return this.get("supported_ext").map(function(i) { return "." + i; }).toString();
    }.property("supported_ext"),
    filesDidChange: function(files) {
        var self = this;
        for(var i = 0; i !== files.length; i++) {
            var file = files.item(i).name;
            if (this.get("supported_ext").indexOf(file.split(".").pop().toLowerCase()) === -1) {
                alert("Nepodporovaný typ souboru: " + file);
                return;
            }
        }
        var uploader = EmberUploader.Uploader.extend({
            url: self.get("url"),
            ajaxSettings: function() {
              var settings = this._super.apply(this, arguments);
              settings['headers'] = {};
              self.get("session").authorize('authorizer:oauth2', (headerName, headerValue) => {
                settings.headers[headerName] = headerValue;
              });
              return settings;
            },
        }).create();

        uploader.on("didUpload", function() {
            self.sendAction("upload_finished");
        });

        uploader.on("didError", function(jqXHR, textStatus, errorThrown) {
            self.sendAction("upload_failed", textStatus, errorThrown);
        });

        if (!Ember.isEmpty(files)) {
            uploader.upload(files[0]);
        }
    }
});
