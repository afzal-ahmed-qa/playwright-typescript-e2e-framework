import { test, expect } from '../../../fixtures';

test('TC-WG-01 dragging the slider updates the value box', async ({ sliderPage }) => {
  await sliderPage.open();
  await expect(sliderPage.valueBox).toHaveValue('25');

  await sliderPage.dragTo(75);

  // mouse drags aren't pixel-perfect, so allow a range around the target
  const value = await sliderPage.currentValue();
  expect(value).toBeGreaterThan(60);
  expect(value).toBeLessThanOrEqual(90);
  await expect(sliderPage.valueBox).toHaveValue(String(value));
});

test('TC-WG-02 progress bar runs to 100%', async ({ progressBarPage }) => {
  test.slow(); // takes about 10 seconds to fill

  await progressBarPage.open();
  await expect(progressBarPage.progressBar).toHaveAttribute('aria-valuenow', '0');

  await progressBarPage.start();

  await expect(progressBarPage.progressBar).toHaveText('100%', { timeout: 20_000 });
  await expect(progressBarPage.resetButton).toBeVisible();
});

test('TC-WG-03 old-style select menu', async ({ selectMenuPage }) => {
  await selectMenuPage.open();

  await selectMenuPage.chooseColour('Green');

  await expect(selectMenuPage.selectedColour).toHaveText('Green');
});

test('TC-IN-01 drag and drop', async ({ droppablePage }) => {
  await droppablePage.open();
  await expect(droppablePage.dropTarget).toHaveText('Drop Here');

  await droppablePage.dragBoxOntoTarget();

  await expect(droppablePage.dropTarget).toHaveText('Dropped!');
});
