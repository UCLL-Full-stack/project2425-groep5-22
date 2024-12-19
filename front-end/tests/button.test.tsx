import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Button from "../components/Button";

test('given: the button with text when: loading is false then: the button shows the text', () => {
  render(<Button loading={false}>Click me</Button>);

  expect(screen.getByText('Click me'));
  expect(screen.queryByRole('status')).toBeNull();
});

test('given: the button with text when: loading is true then: the button shows the loading spinner', () => {
  render(<Button loading={true}>Click me</Button>);

  expect(screen.queryByText('Click me')).toBeNull();
});

test('given: the button with onClick when: clicked then: onClick is called', async () => {
  const onClickMock = jest.fn();

  render(<Button onClick={onClickMock}>Click me</Button>);

  fireEvent.click(screen.getByText('Click me'));

  await waitFor(() => {
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});

test('given: the button when: loading is true and clicked then: onClick should not be triggered', () => {
  const onClickMock = jest.fn();

  render(<Button loading={true} onClick={onClickMock}>Click me</Button>);

  fireEvent.click(screen.getByTestId('click-me'));

  expect(onClickMock).not.toHaveBeenCalled();
});

test('given: the button when: loading state changes then: the button toggles between text and loader', async () => {
  const { rerender } = render(<Button loading={false}>Click me</Button>);

  expect(screen.getByText('Click me'));

  rerender(<Button loading={true}>Click me</Button>);

  expect(screen.queryByText('Click me')).toBeNull();
});