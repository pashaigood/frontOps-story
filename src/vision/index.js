import Story from "../classes/Story";
import isEqual from "lodash/isEqual";

let story = new Story();

story(subject => story.when(subject).is(undefined).then(alert));
const when_person_came_home =
  story.about(Person).and(Home).when(person => person.is.home().and(person.home).is.not.closed()).then(alert);
when_person_came_home(new Person());

let newStory =
  story`about ${Person} and ${Home}.
when person is home and person's home is not closed, then ${sayHello}!`;

newStory({person: new Person()});

function sayHello () {

}


class Subject {
  position = [0, 0];

  constructor (props) {
    Object.assign(this, props);
  }

  at = (object) => {
    return isEqual(this.position, object.position);
  }
}

class Home extends Subject {
  door = new Subject({open: false});
  closed () {
    return this.door.open;
  }
}

class Person extends Subject {
  constructor ({home, ...props} = {}) {
    super(props);
    this._home = home;
  }
  home = () => {
    return this.at(this._home);
  }
}
