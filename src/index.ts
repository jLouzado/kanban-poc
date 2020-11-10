import faker from "faker";
import { init } from "snabbdom/init";
import { classModule } from "snabbdom/modules/class";
import { propsModule } from "snabbdom/modules/props";
import { styleModule } from "snabbdom/modules/style";
import { eventListenersModule } from "snabbdom/modules/eventlisteners";
import { h } from "snabbdom/h"; // helper function for creating vnodes

/** HELPERS */

var patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule // attaches event listeners
]);

const categories = ["None", "Fears", "Suggestions"];

/**
 *
 * @param {Array<T>} xs
 */
const randomSlice = (xs) => {
  const min = faker.random.number({ min: 0, max: xs.length - 1 });
  const max = faker.random.number({ min, max: xs.length - 1 });

  return xs.slice(faker.random.number({ min, max }));
};

const randomTag = () => ({
  name: faker.lorem.word(),
  events: randomSlice([
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() },
    { id: faker.random.uuid(), tag: faker.random.words() }
  ])
});

/** APPLICATIONS */

let state = null;

const initState = () => ({
  response: categories.map((name, index) => ({
    order: index,
    name,
    tags: Array(faker.random.number({ min: 3, max: 7 }))
      .fill(1)
      .map(randomTag)
  })),
  isDragging: false // to grey-out lists while drag in progress
});

const hCategory = (d, category) =>
  h("div.category__container", [
    h("div.category__name", [category.name]),
    h(
      "div.category__tags",
      category.tags.map((t) =>
        h("div.tag", {}, [`${t.name} (${t.events.length})`])
      )
    )
  ]);

const view = (d, state) =>
  h(
    "div.container",
    state.response.map((category) => hCategory(d, category))
  );

const setup = () => {
  state = initState();
  console.log(state);
  let app = document.querySelector(".container");

  const dispatch = (reducer) => (event) => {
    state = reducer(event, state);
    app = patch(app, view(dispatch, state));
  };

  app = patch(app, view(dispatch, state));
};

window.addEventListener("load", setup);
