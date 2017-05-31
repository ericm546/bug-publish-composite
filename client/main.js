import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import { Meteor } from "meteor/meteor";
import "./main.html";
import { Parents, Childs } from "../imports/shared/collections";

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  const sub = Meteor.subscribe("parentsAndChilds");
});

Template.hello.helpers({
  getParents() {
    return Parents.find().fetch();
  },
  getChild(childId) {
    return Childs.findOne({ _id: childId });
  }
});

Template.child.events({
  "click button"(event, instance) {
    console.log(instance)
    Meteor.call("updateRandomString", instance.data.child._id);
  }
});
