import { test, expect } from '../../../fixtures';

test.describe('Widgets', () => {
  test('TC-WG-01 slider changes value', async ({ sliderPage }) => {
    await sliderPage.open();
    await expect(sliderPage.value).toHaveValue('25');

    await sliderPage.dragTo(75);

    const newValue = Number(await sliderPage.slider.inputValue());
    expect(newValue).toBeGreaterThan(60);
    expect(newValue).toBeLessThanOrEqual(90);
    await expect(sliderPage.value).toHaveValue(String(newValue));
  });

  test('TC-WG-02 progress bar reaches 100%', async ({ progressBarPage }) => {
    test.slow(); // the bar takes ~10 seconds to fill

    await progressBarPage.open();
    await expect(progressBarPage.progressBar).toHaveAttribute('aria-valuenow', '0');

    await progressBarPage.startStopButton.click();

    await expect(progressBarPage.progressBar).toHaveText('100%', { timeout: 20_000 });
    await expect(progressBarPage.resetButton).toBeVisible();
  });

  test('TC-WG-03 old-style select menu', async ({ selectMenuPage }) => {
    await selectMenuPage.open();

    await selectMenuPage.oldStyleSelect.selectOption({ label: 'Green' });

    await expect(selectMenuPage.oldStyleSelect.locator('option:checked')).toHaveText('Green');
  });
});

test.describe('Interactions', () => {
  test('TC-IN-01 drag and drop', async ({ droppablePage }) => {
    await droppablePage.open();
    await expect(droppablePage.dropHere).toHaveText('Drop Here');

    await droppablePage.dragAndDrop();

    await expect(droppablePage.dropHere).toHaveText('Dropped!');
  });
});
