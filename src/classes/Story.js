import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';

export default class Story {

  constructor () {
    this.is.not = this.not.bind(this);
  }
  /**
   * @private
   * @type {Array<{mod: string, subject: Object}>}
   */
  story = [];

  /**
   * @private
   * @type {Set<function>}
   */
  actions = new Set();

  /**
   *
   * @return {Story}
   */
  about (subject) {
    this.story.push({ subject, mod: 'about' });
    for (let key in subject) {
      if (subject.hasOwnProperty(key) && isFunction(subject[key])) {
        this.is[key] = this[key] = (...params) => {
          let result = subject[key].apply(subject, params);
          this.story.push({mod: 'custom', subject, result});
          return this;
        }
      }
    }
    return this;
  }

  /**
   *
   * @return {Story}
   */
  when (subject) {
    this.story.push({ subject, mod: 'when' });
    return this;
  }

  /**
   * @type {function(subject): Story}
   */
  if = this.when;

  /**
   *
   * @return {Story}
   */
  is (subject) {
    this.story.push({ subject, mod: 'is' });

    return this;
  }

  /**
   *
   * @param subject
   * @return {Story}
   */
  not (subject) {
    this.story.push({ subject, mod: 'not' });

    return this;
  }

  /**
   * @param {function} action
   * @return {Story}
   */
  then (action) {
    this.actions.add(action);
    return this;
  }


  /**
   *
   * @return {Story}
   */
  to () {
    return this;
  }

  /**
   *
   * @return {Story}
   */
  from () {
    return this;
  }

  /**
   * @private
   */
  run () {
    let storyAbout;
    let currentSubject;
    let result;

    for (let partOf of this.story) {
      switch (partOf.mod) {
        case 'about':
          storyAbout = partOf.subject;
          break;
        case 'when':
          currentSubject = partOf.subject;
          break;
        case 'is':
          result = isEqual(currentSubject, partOf.subject);
          break;
        case 'not':
          result = !isEqual(currentSubject, partOf.subject);
          break;
        case 'custom':
          result = partOf.result;
          break;
      }

      if (result === false) {
        return false;
      }
    }

    let subjects = this.story.map(partOf => partOf.subject);
    this.actions.forEach(action => {
      action.apply(null, subjects)
    });
    return true
  }
}
