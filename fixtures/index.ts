import { test as base } from '@playwright/test';
import { BookStoreApi, type Session } from '../api/BookStoreApi';
import { buildBookStoreUser, type Credentials } from '../test-data/factories';
import { expect } from './matchers';

import { HomePage } from '../pages/HomePage';
import { ButtonsPage } from '../pages/elements/ButtonsPage';
import { CheckBoxPage } from '../pages/elements/CheckBoxPage';
import { DynamicPropertiesPage } from '../pages/elements/DynamicPropertiesPage';
import { LinksPage } from '../pages/elements/LinksPage';
import { RadioButtonPage } from '../pages/elements/RadioButtonPage';
import { TextBoxPage } from '../pages/elements/TextBoxPage';
import { UploadDownloadPage } from '../pages/elements/UploadDownloadPage';
import { WebTablesPage } from '../pages/elements/WebTablesPage';
import { PracticeFormPage } from '../pages/forms/PracticeFormPage';
import { AlertsPage } from '../pages/alerts/AlertsPage';
import { BrowserWindowsPage } from '../pages/alerts/BrowserWindowsPage';
import { FramesPage } from '../pages/alerts/FramesPage';
import { DroppablePage } from '../pages/widgets/DroppablePage';
import { ProgressBarPage } from '../pages/widgets/ProgressBarPage';
import { SelectMenuPage } from '../pages/widgets/SelectMenuPage';
import { SliderPage } from '../pages/widgets/SliderPage';
import { BookDetailPage } from '../pages/bookstore/BookDetailPage';
import { BookStorePage } from '../pages/bookstore/BookStorePage';
import { LoginPage } from '../pages/bookstore/LoginPage';
import { ProfilePage } from '../pages/bookstore/ProfilePage';

// DemoQA is covered in third-party ads that slow pages down and sit on top of buttons.
const AD_HOSTS = /googlesyndication|doubleclick|adservice|adplus|pubads|googletagservices/;

// Blocking the ad requests still leaves their empty containers in the layout. On Linux (CI) the
// fonts render a little wider and the right-hand ad column ends up covering the last table column.
const HIDE_AD_SLOTS = `
  [id^="Ad.Plus"], #fixedban, .col-12.mt-4.col-md-3.col-xl-3 { display: none !important; }
`;

export interface TestUser extends Credentials {
  userId: string;
}

interface PageFixtures {
  homePage: HomePage;
  textBoxPage: TextBoxPage;
  checkBoxPage: CheckBoxPage;
  radioButtonPage: RadioButtonPage;
  webTablesPage: WebTablesPage;
  buttonsPage: ButtonsPage;
  linksPage: LinksPage;
  uploadDownloadPage: UploadDownloadPage;
  dynamicPropertiesPage: DynamicPropertiesPage;
  practiceFormPage: PracticeFormPage;
  alertsPage: AlertsPage;
  browserWindowsPage: BrowserWindowsPage;
  framesPage: FramesPage;
  sliderPage: SliderPage;
  progressBarPage: ProgressBarPage;
  selectMenuPage: SelectMenuPage;
  droppablePage: DroppablePage;
  loginPage: LoginPage;
  profilePage: ProfilePage;
  bookStorePage: BookStorePage;
  bookDetailPage: BookDetailPage;
}

interface DataFixtures {
  bookStoreApi: BookStoreApi;
  /** A brand-new Book Store account, deleted again after the test. */
  testUser: TestUser;
  /** Same as testUser, but the browser is already signed in (session set via API). */
  loggedInUser: TestUser & Session;
}

export const test = base.extend<PageFixtures & DataFixtures>({
  context: async ({ context }, use) => {
    await context.route(AD_HOSTS, (route) => route.abort());
    await context.addInitScript((css) => {
      document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      });
    }, HIDE_AD_SLOTS);
    await use(context);
  },

  homePage: async ({ page }, use) => use(new HomePage(page)),
  textBoxPage: async ({ page }, use) => use(new TextBoxPage(page)),
  checkBoxPage: async ({ page }, use) => use(new CheckBoxPage(page)),
  radioButtonPage: async ({ page }, use) => use(new RadioButtonPage(page)),
  webTablesPage: async ({ page }, use) => use(new WebTablesPage(page)),
  buttonsPage: async ({ page }, use) => use(new ButtonsPage(page)),
  linksPage: async ({ page }, use) => use(new LinksPage(page)),
  uploadDownloadPage: async ({ page }, use) => use(new UploadDownloadPage(page)),
  dynamicPropertiesPage: async ({ page }, use) => use(new DynamicPropertiesPage(page)),
  practiceFormPage: async ({ page }, use) => use(new PracticeFormPage(page)),
  alertsPage: async ({ page }, use) => use(new AlertsPage(page)),
  browserWindowsPage: async ({ page }, use) => use(new BrowserWindowsPage(page)),
  framesPage: async ({ page }, use) => use(new FramesPage(page)),
  sliderPage: async ({ page }, use) => use(new SliderPage(page)),
  progressBarPage: async ({ page }, use) => use(new ProgressBarPage(page)),
  selectMenuPage: async ({ page }, use) => use(new SelectMenuPage(page)),
  droppablePage: async ({ page }, use) => use(new DroppablePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  profilePage: async ({ page }, use) => use(new ProfilePage(page)),
  bookStorePage: async ({ page }, use) => use(new BookStorePage(page)),
  bookDetailPage: async ({ page }, use) => use(new BookDetailPage(page)),

  bookStoreApi: async ({ request }, use) => use(new BookStoreApi(request)),

  testUser: async ({ bookStoreApi }, use) => {
    const credentials = buildBookStoreUser();
    const response = await bookStoreApi.createUser(credentials);
    expect(response.status(), `creating test user ${credentials.userName}`).toBe(201);
    const { userID } = await response.json();

    await use({ ...credentials, userId: userID });

    await bookStoreApi.cleanUpUser(userID, credentials);
  },

  loggedInUser: async ({ testUser, bookStoreApi, context, baseURL }, use) => {
    const session = await bookStoreApi.login(testUser, testUser.userId);

    // These are the cookies the site itself sets after a successful UI login.
    const url = baseURL ?? 'https://demoqa.com';
    await context.addCookies([
      { name: 'token', value: session.token, url },
      { name: 'expires', value: session.expires, url },
      { name: 'userID', value: testUser.userId, url },
      { name: 'userName', value: testUser.userName, url },
    ]);

    await use({ ...testUser, ...session });
  },
});

export { expect };
