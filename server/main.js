import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Parents, Childs } from "../imports/shared/collections";

Meteor.startup(() => {
  if (Parents.find().fetch().length === 0) {
    const addParentAndChilds = () => {
      const childIds = [
        Random.id(),
        Random.id(),
        Random.id(),
        Random.id(),
        Random.id()
      ];

      Parents.insert({ _id: Random.id(), name: Random.id(), childs: childIds });
      childIds.forEach(childId => {
        Childs.insert({ _id: childId, name: Random.id() });
      });
    };

    addParentAndChilds();
    addParentAndChilds();
    addParentAndChilds();
  }
});

Meteor.publishComposite("parentsAndChilds", filterByUser => ({
  find() {
    return Parents.find();
  },
  children: [
    {
      find(parent) {
        return Childs.find({ _id: { $in: parent.childs } });
      },
      children: [
        {
          find(child) {
            //fake a sub children that take time to load
            Meteor._sleepForMs(100);
            return Childs.find({ _id: { $in: [] } });
          }
        }
      ]
    }
  ]
}));

Meteor.methods({
  updateRandomString(childId) {
    Parents.update(
      { childs: childId },
      { $set: { name: Random.id() } },
      { multi: true }
    );
    Meteor._sleepForMs(50);
    Childs.update({ _id: childId }, { $set: { name: Random.id() } });
  }
});
