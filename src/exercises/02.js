// Compound Components

import React from // createContext,
// useState,
// useRef,
// useEffect,
// useCallback,
// useMemo,
// useContext,
'react';
import { Switch } from '../switch';

class Toggle extends React.Component {
  static On = props => (props.on ? props.children : null);

  static Off = props => (props.on ? null : props.children);

  static Button = ({ on, toggle }) => (
    <Switch on={on} onClick={toggle} />
  );

  static compoundComponents = [Toggle.On, Toggle.Off, Toggle.Button];

  // you can create function components as static properties!
  // for example:
  // static Candy = (props) => <div>CANDY! {props.children}</div>
  // Then that could be used like: <Toggle.Candy />
  // This is handy because it makes the relationship between the
  // parent Toggle component and the child Candy component more explicit
  // 🐨 You'll need to create three such components here: On, Off, and Button
  //    The button will be responsible for rendering the <Switch /> (with the right props)
  // 💰 Combined with changes you'll make in the `render` method, these should
  //    be able to accept `on`, `toggle`, and `children` as props.
  //    Note that they will _not_ have access to Toggle instance properties
  //    like `this.state.on` or `this.toggle`.
  state = { on: false };
  toggle = () =>
    this.setState(
      ({ on }) => ({ on: !on }),
      () => this.props.onToggle(this.state.on),
    );
  render() {
    // we're trying to let people render the components they want within the Toggle component.
    // But the On, Off, and Button components will need access to the internal `on` state as
    // well as the internal `toggle` function for them to work properly. So here we can
    // take all this.props.children and make a copy of them that has those props.
    //
    // To do this, you can use:
    // 1. React.Children.map: https://reactjs.org/docs/react-api.html#reactchildrenmap
    // 2. React.cloneElement: https://reactjs.org/docs/react-api.html#cloneelement
    //
    // 🐨 you'll want to completely replace the code below with the above logic.
    const { on } = this.state;
    const { children } = this.props;
    // here React.Children.map is used, instead of this.props.map(children => {}) because if
    // there is only one child to the component it will not be an array
    return React.Children.map(children, child => {
      if (Toggle.compoundComponents.includes(child.type)) {
        return React.cloneElement(child, {
          on,
          toggle: this.toggle,
        });
      } else {
        return child;
      }
    });
  }
}

// TODO Fix tests

// const ToggleContext = createContext();

// const useEffectAfterMount = (cb, dependencies) => {
//   const justMounted = useRef(true);
//   useEffect(() => {
//     if (!justMounted.current) {
//       return cb();
//     }
//     justMounted.current = false;
//   }, dependencies);
// };

// const Toggle = props => {
//   const [on, setOn] = useState(false);
//   const toggle = useCallback(() => setOn(oldOn => !oldOn), []);
//   useEffectAfterMount(() => {
//     props.onToggle(on);
//   }, [on]);
//   const value = useMemo(() => ({ on, toggle }), [on]);
//   return (
//     <ToggleContext.Provider value={value}>
//       {props.children}
//     </ToggleContext.Provider>
//   );
// };

// const useToggleContext = () => {
//   const context = useContext(ToggleContext);
//   if (!context) {
//     throw new Error(
//       'Toggle compound components cannot be rendered outside the Toggle Component',
//     );
//   }
//   return context;
// };

// const On = ({ children }) => {
//   const { on } = useToggleContext();
//   return on ? children : null;
// };

// const Off = ({ children }) => {
//   const { on } = useToggleContext();
//   return on ? null : children;
// };

// const Button = props => {
//   const { on, toggle } = useToggleContext();
//   return <Switch on={on} onClick={toggle} {...props} />;
// };

// Toggle.On = On;
// Toggle.Off = Off;
// Toggle.Button = Button;

// 💯 Support rendering non-Toggle components within Toggle without incurring warnings in the console.
// for example, try to render a <span>Hello</span> inside <Toggle />

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <p>This paragraph should not produce an error</p>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <Toggle.Button />
    </Toggle>
  );
}
Usage.title = 'Compound Components';

export { Toggle, Usage as default };
