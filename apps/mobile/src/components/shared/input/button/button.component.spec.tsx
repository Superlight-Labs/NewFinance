import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import Button from './button.component';

it('renders correctly', () => {
  render(<Button onPress={() => {}}>Hi there</Button>);
});

it('Executes the action passed to a button', () => {
  const btnText = 'Hi there';
  const onPress = jest.fn();

  render(<Button onPress={onPress}>{btnText}</Button>);

  fireEvent.press(screen.getByText(btnText));

  expect(onPress).toBeCalledTimes(1);
});
