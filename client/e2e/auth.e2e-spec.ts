import { browser, by, element } from 'protractor';

describe('Auth Component', () => {
  browser.get('#/login');

  const rootElement = element(by.css('cbs-auth .cbs-auth'));
  const loginElement = element(by.id('username-id'));
  const passwordElement = element(by.id('password-id'));
  const submitBtn = element(by.css('input[type="submit"]'));
  const errorMessage = element(by.css('.cbs-auth__error-message'));
  const formElement = element(by.css('form.cbs-auth-form'));

  beforeEach(function () {

  });

  it('should remove prebootstrap block', () => {
    if (rootElement.isPresent()) {
      expect(element(by.id('pre-bootstrap-container')).isPresent()).toEqual(false);
    } else {
      expect(element(by.id('pre-bootstrap-container')).isPresent()).toEqual(true);
    }
  });

  it('should have cbs-auth block', () => {
    expect(rootElement.isPresent()).toEqual(true);
  });

  it('should have form with class .cbs-auth-form', function () {
    expect(formElement.isPresent()).toEqual(true);
  });

  it('should have a disabled signin button', () => {
    expect(submitBtn.isPresent()).toEqual(true);
    expect(submitBtn.isEnabled()).toBeFalsy();
  });

  it('should have an enabled signin button', () => {
    expect(submitBtn.isEnabled()).toBeFalsy();
    loginElement.sendKeys('John');
    passwordElement.clear().then(() => {
      passwordElement.sendKeys('eliza');
    });
    expect(submitBtn.isEnabled()).toBeTruthy();
  });

  it('should view error messages', () => {
    expect(errorMessage.isPresent()).toEqual(false);
    loginElement.clear().then(() => {
      loginElement.sendKeys('John');
    });
    passwordElement.clear().then(() => {
      passwordElement.sendKeys('eliza55');
    });
    formElement.submit();
    browser.sleep(350);
    expect(element(by.css('.cbs-auth__error-message')).isPresent()).toEqual(true);
  });

  it('should successfully login the user', () => {
    loginElement.clear().then(() => {
      loginElement.sendKeys('admin');
    });
    passwordElement.clear().then(() => {
      passwordElement.sendKeys('admin');
    });
    formElement.submit();
    browser.sleep(400);
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl +  '#/profiles');
  });

});
