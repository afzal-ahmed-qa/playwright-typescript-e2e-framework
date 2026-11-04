import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type Gender = 'Male' | 'Female' | 'Other';
export type Hobby = 'Sports' | 'Reading' | 'Music';

export interface DateOfBirth {
  day: number;
  /** Full month name, e.g. 'May' */
  month: string;
  year: number;
}

export interface StudentData {
  firstName: string;
  lastName: string;
  gender: Gender;
  mobile: string;
  email?: string;
  dateOfBirth?: DateOfBirth;
  subjects?: string[];
  hobbies?: Hobby[];
  picturePath?: string;
  currentAddress?: string;
  state?: string;
  city?: string;
}

export class PracticeFormPage extends BasePage {
  protected readonly path = '/automation-practice-form';

  readonly form: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly mobile: Locator;
  readonly dateOfBirth: Locator;
  readonly subjectsInput: Locator;
  readonly picture: Locator;
  readonly currentAddress: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly submitButton: Locator;

  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly closeModalButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator('#userForm');
    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#userEmail');
    this.mobile = page.locator('#userNumber');
    this.dateOfBirth = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');
    this.picture = page.locator('#uploadPicture');
    this.currentAddress = page.locator('#currentAddress');
    this.stateInput = page.locator('#state input');
    this.cityInput = page.locator('#city input');
    this.submitButton = page.getByRole('button', { name: 'Submit' });

    this.modal = page.getByRole('dialog');
    this.modalTitle = this.modal.locator('.modal-title');
    this.closeModalButton = this.modal.getByRole('button', { name: 'Close' });
  }

  genderRadio(gender: Gender): Locator {
    return this.page.locator('#genterWrapper').getByRole('radio', { name: gender, exact: true });
  }

  async selectGender(gender: Gender): Promise<void> {
    await this.page.locator(`#genterWrapper label`).getByText(gender, { exact: true }).click();
  }

  async selectHobby(hobby: Hobby): Promise<void> {
    await this.page.locator('#hobbiesWrapper label').getByText(hobby, { exact: true }).click();
  }

  async pickDate({ day, month, year }: DateOfBirth): Promise<void> {
    await this.dateOfBirth.click();
    await this.page.locator('.react-datepicker__month-select').selectOption({ label: month });
    await this.page.locator('.react-datepicker__year-select').selectOption(String(year));
    const dayClass = `.react-datepicker__day--${String(day).padStart(3, '0')}`;
    await this.page.locator(`${dayClass}:not(.react-datepicker__day--outside-month)`).click();
  }

  /** Types into a react-select dropdown and picks the highlighted option. */
  async chooseFromSelect(input: Locator, value: string): Promise<void> {
    await input.fill(value);
    await input.press('Enter');
  }

  async fillForm(data: StudentData): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    if (data.email) await this.email.fill(data.email);
    await this.selectGender(data.gender);
    await this.mobile.fill(data.mobile);
    if (data.dateOfBirth) await this.pickDate(data.dateOfBirth);
    for (const subject of data.subjects ?? []) await this.chooseFromSelect(this.subjectsInput, subject);
    for (const hobby of data.hobbies ?? []) await this.selectHobby(hobby);
    if (data.picturePath) await this.picture.setInputFiles(data.picturePath);
    if (data.currentAddress) await this.currentAddress.fill(data.currentAddress);
    if (data.state) await this.chooseFromSelect(this.stateInput, data.state);
    if (data.city) await this.chooseFromSelect(this.cityInput, data.city);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /** Value shown in the confirmation modal for a label, e.g. summaryValue('Student Name'). */
  summaryValue(label: string): Locator {
    return this.modal
      .locator('tbody tr')
      .filter({ has: this.page.getByRole('cell', { name: label, exact: true }) })
      .locator('td')
      .nth(1);
  }
}
