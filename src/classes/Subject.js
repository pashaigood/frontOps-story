import isEqual from "lodash/isEqual";

export class Subject {
  position = [0, 0];

  constructor (props) {
    Object.assign(this, props);
  }

  at = (object) => {
    return isEqual(this.position, object.position);
  }
}

export class Home extends Subject {
  door = new Subject({ open: false });

  closed = () => {
    return !this.door.open;
  }
}

export class Person extends Subject {
  constructor ({ home, ...props } = {}) {
    super(props);
    this._home = home;
  }

  home = () => {
    return this.at(this._home);
  }
}
