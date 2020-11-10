import faker from "faker";
import { init } from "snabbdom/build/package/init";
import { classModule } from "snabbdom//build/package/modules/class";
import { propsModule } from "snabbdom/build/package/modules/props";
import { styleModule } from "snabbdom/build/package/modules/style";
import { eventListenersModule } from "snabbdom/build/package/modules/eventlisteners";
import { h } from "snabbdom/build/package/h"; // helper function for creating vnodes
import { VNode } from "snabbdom/build/package/vnode";

/** HELPERS */

var patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

const categories = ["None", "Fears", "Suggestions"];

const randomSlice = <T>(xs: T[]) => {
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
    { id: faker.random.uuid(), tag: faker.random.words() },
  ]),
});

/** APPLICATIONS */

type State = any;
type Dispatcher = typeof dispatch;

let state: State = null;
let app: VNode | Element = document.querySelector("#container") as Element;

const dispatch = (reducer: (action: unknown, state: State) => State) => (
  event: Event
) => {
  state = reducer(event, state);
  app = patch(app, view(dispatch, state));
};

const initState = () => ({
  response: categories.map((name, index) => ({
    order: index,
    name,
    tags: Array(faker.random.number({ min: 3, max: 7 }))
      .fill(1)
      .map(randomTag),
  })),
  isDragging: false, // to grey-out lists while drag in progress
});

const hCategory = (d: Dispatcher, category) =>
  h("div.category__container", [
    h("div.category__name", [category.name]),
    h(
      "div.category__tags",
      category.tags.map((t) =>
        h("div.tag", {}, [`${t.name} (${t.events.length})`])
      )
    ),
  ]);

const view = (d: Dispatcher, state: State) =>
  h(
    "div#container",
    state.response.map((category) => hCategory(d, category))
  );

const setup = () => {
  state = initState();
  console.log(state);

  app = patch(app, view(dispatch, state));
};

window.addEventListener("load", setup);
