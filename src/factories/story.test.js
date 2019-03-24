import story from './story'
import { Person, Home } from '../classes/Subject'

const prefix = __dirname.split('/src/')[1].replace('/__tests__', '') + '/';

describe(prefix + 'story', () => {
  let Tim, home, Mom;
  let sayHelloToPerson = jasmine.createSpy('spy');
  let isPersonAtHome;

  beforeEach(() => {
    home = new Home({ position: [120, 200] });
    Tim = new Person({ home, position: [2343, 435] });
    Mom = new Person({ home, position: home.position });
    isPersonAtHome = story.about(person =>
      story.when(person.position).is(home.position).then(sayHelloToPerson)
    );
    sayHelloToPerson.calls.reset();
  });

  it('should build positive statement', () => {
    expect(isPersonAtHome(Tim)).toBe(false);
    expect(sayHelloToPerson).not.toHaveBeenCalled();
  });

  it('should reuse statement', () => {
    expect(isPersonAtHome(Tim)).toBe(false);
    expect(sayHelloToPerson).not.toHaveBeenCalled();

    expect(isPersonAtHome(Mom)).toBe(true);
    expect(sayHelloToPerson).toHaveBeenCalled();
  });

  it ('should build positive like statement', () => {
    let isPersonHome = story.about(person =>
      story.when(person.position).like(home.position).then(sayHelloToPerson)
    );

    expect(isPersonHome(Mom)).toBe(true);
    expect(sayHelloToPerson).toHaveBeenCalledTimes(1);
  });

  it('should build long statement', () => {
    let isPersonHome = story.about(person =>
      story.when(person.position).is.like.a(home.position).then(sayHelloToPerson)
    );

    expect(isPersonHome(Mom)).toBe(true);
  });

  it('should build custom dictionary statement', () => {
    let isPersonAtHome = story.about(person =>
      story.when(person).home().then(sayHelloToPerson)
    );
    expect(isPersonAtHome(Tim)).toBe(false);
    expect(sayHelloToPerson).not.toHaveBeenCalled();
    expect(isPersonAtHome(Mom)).toBe(true);
    expect(sayHelloToPerson).toHaveBeenCalled();
  });

  it('should combine statement', () => {
    let toKnockOnTheDoor = jasmine.createSpy('spy');
    let isDoorClosed = story.about(home =>
      story.when(home).is.closed()
    );

    let whenCannotGetHomeAndSomeoneInside = story.about(
      home => isDoorClosed(home),
      person => isPersonAtHome(person)
    ).then(toKnockOnTheDoor);

    expect(whenCannotGetHomeAndSomeoneInside(home, Mom)).toBe(true);
    home = {...home};
    home.door.open = true;
    expect(whenCannotGetHomeAndSomeoneInside(home, Mom)).toBe(false);
    expect(toKnockOnTheDoor).toHaveBeenCalledTimes(1);
  })
});
