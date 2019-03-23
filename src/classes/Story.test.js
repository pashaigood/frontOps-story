import Story from './Story';
import isEqual from 'lodash/isEqual';

const prefix = __dirname.split('/src/')[1].replace('/__tests__', '') + '/';

describe(prefix + 'Story', () => {
  let Tim, home, Mom, story;
  let sayHelloToUser = jasmine.createSpy('spy');
  beforeEach(() => {
    story = new Story();
    home = new Subject({position: [200, 200]});
    Mom = new Person({home, position: home.position});
    Tim = new Person({position: [0, 200]});

    sayHelloToUser.calls.reset();
  });


  it('user position should be equal home position', () => {
    expect(Mom.at(home)).toBeTruthy();
  });

  it('should test false statement.', () => {
    let Tim_came_home = Tim => story.about(Tim).
    when(Tim.position).is(home.position).then(sayHelloToUser);

    expect(Tim_came_home(Tim).run()).toBe(false);
    expect(sayHelloToUser).toBeCalledTimes(0);
  });

  it('should test true statement', () => {
    let Mom_at_home = Mom => story.about(Mom).
    when(Mom.position).is(home.position).then(sayHelloToUser);

    expect(Mom_at_home(Mom).run()).toBe(true);
    expect(sayHelloToUser).toBeCalledTimes(1);
  });

  it('should use not statement', () => {
    let Tim_is_not_at_home = Tim => story.about(Tim).
    if(Tim.position).is.not(home.position).then(sayHelloToUser);

    expect(Tim_is_not_at_home(Tim).run()).toBeTruthy();
  });

  it('should use custom statements', () => {
    let Mom_at_home = Mom => story.about(Mom).
    when(Mom).is.home().then(sayHelloToUser);

    expect(Mom_at_home(Mom).run()).toBe(true);
  });

  xit('should use not with custom statements', () => {
    let Mom_at_home = Mom => story.about(Mom).
    when(Mom).is.not.at(home).then(sayHelloToUser);

    expect(Mom_at_home(Mom).run()).toBe(true);
  })
});

class Subject {
  position = [0, 0];

  constructor (props) {
    Object.assign(this, props);
  }

  at = (object) => {
    return isEqual(this.position, object.position);
  }
}

class Person extends Subject {
  constructor ({home, ...props}) {
    super(props);
    this._home = home;
  }
  home = () => {
    return this.at(this._home);
  }
}
