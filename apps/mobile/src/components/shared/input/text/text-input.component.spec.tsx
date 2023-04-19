import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import TextInput from './text-input.component';

it('renders correctly', () => {
  render(<TextInput onChangeText={() => undefined} value="Test" />);
});

it('Executes the action passed to a button', () => {
  const text = 'Hi there';
  const changeText = jest.fn();

  render(<TextInput onChangeText={changeText} value={text} />);

  fireEvent.changeText(screen.getByDisplayValue(text));

  expect(changeText).toBeCalledTimes(1);
});
