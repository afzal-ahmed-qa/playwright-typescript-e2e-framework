import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { SubmissionModal } from '../components/SubmissionModal';
import type { Gender, Hobby, Student } from '../../test-data/factories';

export class PracticeFormPage extends BasePage {
  protected readonly path = '/automation-practice-form';

  readonly form: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly mobile: Locator;
  readonly dateOfBirth: Locator;
  readonly cityInput: Locator;
  readonly dropdownOptions: Locator;
  readonly summary: SubmissionModal;

  private readonly subjectsInput: Locator;
  private readonly picture: Locator;
  private readonly currentAddress: Locator;
  private readonly stateInput: Locator;
  private readonly submitButton: Locator;

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
    this.dropdownOptions = page.getByRole('option');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.summary = new SubmissionModal(page);
  }

  genderRadio(gender: Gender): Locator {
    return this.page.locator('#genterWrapper').getByRole('radio', { name: gender, exact: true });
  }

  async register(student: Student): Promise<void> {
    await this.fillForm(student);
    await this.submit();
  }

  async fillForm(student: Student): Promise<void> {
    await this.firstName.fill(student.firstName);
    await this.lastName.fill(student.lastName);
    if (student.email) await this.email.fill(student.email);
    await this.selectGender(student.gender);
    await this.mobile.fill(student.mobile);
    if (student.dateOfBirth) await this.pickDateOfBirth(student.dateOfBirth);
    for (const subject of student.subjects ?? []) await this.pickFromDropdown(this.subjectsInput, subject);
    for (const hobby of student.hobbies ?? []) await this.selectHobby(hobby);
    if (student.picture) await this.picture.setInputFiles(student.picture);
    if (student.address) await this.currentAddress.fill(student.address);
    if (student.state) await this.selectState(student.state);
    if (student.city) await this.pickFromDropdown(this.cityInput, student.city);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /** Types like a user would, so the field's 10-character limit applies. */
  async typeMobile(digits: string): Promise<void> {
    await this.mobile.pressSequentially(digits);
  }

  async selectState(state: string): Promise<void> {
    await this.pickFromDropdown(this.stateInput, state);
  }

  async openCityDropdown(): Promise<void> {
    await this.cityInput.click();
  }

  private async selectGender(gender: Gender): Promise<void> {
    await this.page.locator('#genterWrapper label').getByText(gender, { exact: true }).click();
  }

  private async selectHobby(hobby: Hobby): Promise<void> {
    await this.page.locator('#hobbiesWrapper label').getByText(hobby, { exact: true }).click();
  }

  private async pickDateOfBirth({ day, month, year }: NonNullable<Student['dateOfBirth']>): Promise<void> {
    await this.dateOfBirth.click();
    await this.page.locator('.react-datepicker__month-select').selectOption({ label: month });
    await this.page.locator('.react-datepicker__year-select').selectOption(String(year));
    const dayCell = `.react-datepicker__day--${String(day).padStart(3, '0')}`;
    await this.page.locator(`${dayCell}:not(.react-datepicker__day--outside-month)`).click();
  }

  // State, city and subjects are react-select widgets: type, then Enter picks the first match.
  private async pickFromDropdown(input: Locator, value: string): Promise<void> {
    await input.fill(value);
    await input.press('Enter');
  }
}

/** Formats a date the way the submission summary shows it, e.g. "07 March,1998". */
export function summaryDate({ day, month, year }: NonNullable<Student['dateOfBirth']>): string {
  return `${String(day).padStart(2, '0')} ${month},${year}`;
}
