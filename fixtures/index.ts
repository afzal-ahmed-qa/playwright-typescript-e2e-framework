import { test as base, expect as baseExpect, type Locator } from '@playwright/test';
import { BookStoreApi, type Credentials } from '../api/BookStoreApi';
import { uniqueUser } from '../test-data/users';
import { AlertsPage } from '../pages/AlertsPage';
import { BooksPage } from '../pages/BooksPage';
import { BrowserWindowsPage } from '../pages/BrowserWindowsPage';
import { ButtonsPage } from '../pages/ButtonsPage';
import { CheckBoxPage } from '../pages/CheckBoxPage';
import { DroppablePage } from '../pages/DroppablePage';
import { DynamicPropertiesPage } from '../pages/DynamicPropertiesPage';
import { FramesPage } from '../pages/FramesPage';
import { LinksPage } from '../pages/LinksPage';
import { LoginPage } from '../pages/LoginPage';
import { PracticeFormPage } from '../pages/PracticeFormPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProgressBarPage } from '../pages/ProgressBarPage';
import { RadioButtonPage } from '../pages/RadioButtonPage';
import { SelectMenuPage } from '../pages/SelectMenuPage';
import { SliderPage } from '../pages/SliderPage';
import { TextBoxPage } from '../pages/TextBoxPage';
import { UploadDownloadPage } from '../pages/UploadDownloadPage';
import { WebTablesPage } from '../pages/WebTablesPage';

/** demoqa.com serves heavy third-party ads that slow tests down and cover buttons. */
const AD_HOSTS = /googlesyndication|doubleclick|adservice|adplus|pubads|googletagservices/;

export interface TestUser extends Credentials {
  userId: string;
}

interface Fixtures {
  alertsPage: AlertsPage;
  booksPage: BooksPage;
  browserWindowsPage: BrowserWindowsPage;
  buttonsPage: ButtonsPage;
  checkBoxPage: CheckBoxPage;
  droppablePage: DroppablePage;
  dynamicPropertiesPage: DynamicPropertiesPage;
  framesPage: FramesPage;
  linksPage: LinksPage;
  loginPage: LoginPage;
  practiceFormPage: PracticeFormPage;
  profilePage: ProfilePage;
  progressBarPage: ProgressBarPage;
  radioButtonPage: RadioButtonPage;
  selectMenuPage: SelectMenuPage;
  sliderPage: SliderPage;
  textBoxPage: TextBoxPage;
  uploadDownloadPage: UploadDownloadPage;
  webTablesPage: WebTablesPage;

  bookStoreApi: BookStoreApi;
  /** A Book Store user created through the API before the test and deleted after it. */
  testUser: TestUser;
}

export const test = base.extend<Fixtures>({
  // Block ads for every page in the context, including new tabs and popups.
  context: async ({ context }, use) => {
    await context.route(AD_HOSTS, (route) => route.abort());
    await use(context);
  },

  alertsPage: async ({ page }, use) => use(new AlertsPage(page)),
  booksPage: async ({ page }, use) => use(new BooksPage(page)),
  browserWindowsPage: async ({ page }, use) => use(new BrowserWindowsPage(page)),
  buttonsPage: async ({ page }, use) => use(new ButtonsPage(page)),
  checkBoxPage: async ({ page }, use) => use(new CheckBoxPage(page)),
  droppablePage: async ({ page }, use) => use(new DroppablePage(page)),
  dynamicPropertiesPage: async ({ page }, use) => use(new DynamicPropertiesPage(page)),
  framesPage: async ({ page }, use) => use(new FramesPage(page)),
  linksPage: async ({ page }, use) => use(new LinksPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  practiceFormPage: async ({ page }, use) => use(new PracticeFormPage(page)),
  profilePage: async ({ page }, use) => use(new ProfilePage(page)),
  progressBarPage: async ({ page }, use) => use(new ProgressBarPage(page)),
  radioButtonPage: async ({ page }, use) => use(new RadioButtonPage(page)),
  selectMenuPage: async ({ page }, use) => use(new SelectMenuPage(page)),
  sliderPage: async ({ page }, use) => use(new SliderPage(page)),
  textBoxPage: async ({ page }, use) => use(new TextBoxPage(page)),
  uploadDownloadPage: async ({ page }, use) => use(new UploadDownloadPage(page)),
  webTablesPage: async ({ page }, use) => use(new WebTablesPage(page)),

  bookStoreApi: async ({ request }, use) => use(new BookStoreApi(request)),

  testUser: async ({ bookStoreApi }, use) => {
    const credentials = uniqueUser();
    const response = await bookStoreApi.createUser(credentials);
    baseExpect(response.status(), 'test user should be created').toBe(201);
    const { userID } = await response.json();

    await use({ ...credentials, userId: userID });

    await bookStoreApi.cleanUpUser(userID, credentials);
  },
});

export const expect = baseExpect.extend({
  /**
   * Passes when a form field fails HTML5 validation (required, pattern,
   * minlength, ...). Retries until the timeout like built-in assertions.
   */
  async toBeInvalid(locator: Locator, options?: { timeout?: number }) {
    let valid: boolean | undefined;
    const pass = await baseExpect
      .poll(async () => (valid = await locator.evaluate((el) => (el as HTMLInputElement).validity.valid)), options)
      .toBe(this.isNot)
      .then(
        () => !this.isNot,
        () => this.isNot,
      );
    return {
      name: 'toBeInvalid',
      pass,
      message: () => `expected ${locator} ${this.isNot ? 'not ' : ''}to be invalid, but validity.valid was ${valid}`,
    };
  },
});
