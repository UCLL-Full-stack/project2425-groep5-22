import React from "react"
import { render, screen } from '@testing-library/react';
import NoGames from "../components/game/NoGames";

window.React = React;

test('given: the no games component when: component loads then: the text should be visible on the page', async () => {
  render(<NoGames />)

  expect(screen.getByText('Niks gevonden'))
  expect(screen.getByText('Er werden op dit moment spijtig genoeg nog geen spellen gevonden. 😢'))
})