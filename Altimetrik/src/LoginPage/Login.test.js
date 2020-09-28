import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { LoginPage } from '../LoginPage';
import LogoHeader from '../LogoHeader';
// Props, which we pass to component
const props = {
 localization: {
  common: {
   login: 'Login',
  },
  form: {
   username: 'username',
   password: 'Password',
   usernameRequired: 'username is required',
   usernameNotValid: 'username is not valid',
   passwordRequired: 'Password is required',
  }
 },
 currentLang: 'en',
 login: () => {},
};
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe('>>>LoginPage - Shallow Render REACT COMPONENTS', () => {
 let wrapper;
// Create 'snapshot'
 it('+++ render LoginPage correctly, snapshot', () => {
  const component = wrapper(props);
  expect(toJson(component)).toMatchSnapshot();
 });
// Check render comonent without errors
 it('+++ render the DUMB component', () => {
  expect(wrapper(props).length).toEqual(1);
 });
// Check the existence of header component
 it('+++ contains LogoHeader component', () => {
  expect(wrapper(props).find(LogoHeader).length).toBe(1);
});
// Simple behavior for fill in the fields
 it('+++ simulate change username, password input', () => {
  const component = wrapper(props);
  const eventEmail = {
   target: { name: 'username', value: 'username' }
  };
  const eventPassword = {
   target: { name: 'password', value: '123456' }
  };
  component.find('[name="username"]').simulate('change', eventEmail);
  component.find('[name="password"]')
   .simulate('change', eventPassword);
expect(component.state('username')).toEqual('username');
  expect(component.state('password')).toEqual('123456');
  expect(component.find('[name="username"]').prop('value'))
   .toEqual('username');
  expect(component.find('[name="password"]').prop('value'))
   .toEqual('123456');
 });
 
 it('+++ triggers submit handler with valid form data', () => {
  const mockFn = jest.fn(() => Promise.resolve({}));
  props.login = mockFn;
  const component = wrapper(props)
    .setState({ username: 'username', password: '123456' });
  component.find('button[type="button"]').simulate('click');

  expect(mockFn).toHaveBeenCalledWith({ 
    username: 'username', password: '123456'
  });
  expect(mockFn).toHaveBeenCalledTimes(1);
 });
});
// setup for testing connected component
const mockStore = configureStore(middlewares);
const localization = {
 data: {
  localization: {
   common: {
    login: 'Login',
   },
   form: {
    username: 'username',
    password: 'Password',
    usernameRequired: 'username is required',
    usernameNotValid: 'username is not valid',
    passwordRequired: 'Password is required',
   },
  },
  type: 'en',
 },
};
const auth = {
 current: {},
};
const initialState = {
 localization,
 auth,
};
describe('>>>LoginPage - REACT-REDUX (Shallow + passing the {store} directly)’, () => {
 let container;
 beforeEach(() => {
  const store = mockStore(initialState);
  container = shallow(<ConnectedLoginPage store={store} />);
 });
it('+++ render the connected(SMART) component', () => {
  expect(container.length).toEqual(1);
 });

 it('+++ check Prop matches with initialState', () => {
  expect(container.prop('currentLang')).toEqual('en');
 });
});
describe('>>>LoginPage — REACT-REDUX (Mount + wrapping in Provider)', () => {
 let container;
 beforeEach(() => {
  const store = mockStore(initialState);
  container = mount(
   <Provider store={store}><ConnectedLoginPage /></Provider>
  );
 });
it('+++ render the connected(SMART) component', () => {
  expect(container.find(ConnectedLoginPage).length).toEqual(1);
 });
it('+++ contains class component', () => {
  expect(container.find('.grayBackground').length).toBe(1);
 });

 it('+++ check Prop matches with initialState', () => {
  expect(container.find(LoginPage).prop('currentLang'))
   .toEqual(initialState.localization.data.type);
 });
});