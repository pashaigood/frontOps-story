import { createSelector } from 'reselect';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual'

function Story () {
  const stories = [];
  const actions = new Set();

  this.pipe = pipe.bind(this);
  this.run = run.bind(this);
  this.is = pipe.bind(this, (context, subject) => {
    return isEqual(context.about, subject);
  });

  this.a = this.is;

  this.like = pipe.bind(this, (context, subject) => {
    return isEqual(context.about, subject);
  });

  this.when = pipe.bind(this, (context, subject) => {
    context.about = subject;
    return true;
  });

  this.then = then.bind(this);

  chainMethods.call(
    this,
    ['is', 'a', 'like', 'when', 'then'],
    ['is', 'like']
  );

  function chainMethods (methodsToChain, chainedMethods) {
    methodsToChain.forEach(chainName => {
      chainedMethods.forEach(chainedName => {
        this[chainedName][chainName] = this[chainName];
      })
    })
  }

  function pipe (invoke, subject) {
    stories.push({invoke, subject});
    return this;
  }

  function then (action) {
    actions.add(action);
    return this;
  }

  function run (params) {
    let context = {
      params
    };
    let result;
    for (let partOf of stories) {
      result = partOf.invoke(context, partOf.subject);
      process.DEBUG && console.log(partOf);
      if (!result) {
        return false;
      }
    }
    actions.forEach(action => action.apply(null, stories.map(s => s.subject)));
    return true;
  }
}

function about (...params) {
  let rootStory;

  if (params.length === 1) {
    let callback = params[0];
    rootStory = createSelector(
      (...params) => callback.apply(null, params).run(),
      result => result
    );
  } else {
    rootStory = createSelector(
      ...params,
      (...results) => results.reduce((r1, r2) => r1 && r2, true)
    )
  }

  const story = new Story();
  story.pipe(
    ({params}) => {
      return rootStory.apply(null, params);
    }
  );
  const invoke = function (...params) {
    return story.run(params);
  };

  invoke.then = (callback) => {
    story.then(callback);
    return invoke
  };

  return invoke
}

function when (subject) {
  let story = new Story();
  story.when(subject);
  Object.keys(subject).forEach(key => {
    if (isFunction(subject[key])) {
      let invoke = (...params) => subject[key].apply(subject, params);
      story.is[key] = story[key] = story.pipe.bind(story, invoke, subject);
    }
  });
  return story;
}

export default {
  about,
  when
};
