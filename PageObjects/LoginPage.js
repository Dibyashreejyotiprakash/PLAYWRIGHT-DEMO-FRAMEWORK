import {test, expect} from '@playwright/test';
import Base from '../Initiate/Base.js';

const base = new Base();

class LoginPage {

        constructor(page) {
            this.page = page;
            this.usernameInput = "//input[@placeholder='Username']";
            this.passwordInput = "//input[@placeholder='Password']";
            this.loginButton = "//button[normalize-space()='Login']";
        }


    async login(username, password) {
        if (!username || !password) {
            throw new Error('Username and password are required for login');
        }

        console.log('Filling username field...');
        await this.page.locator(this.usernameInput).waitFor({ state: 'visible', timeout: 10000 });
        await this.page.fill(this.usernameInput, username);

        console.log('Filling password field...');
        await this.page.fill(this.passwordInput, password);

        console.log('Clicking login button...');
        await this.page.click(this.loginButton);

        console.log('Waiting for page to load...');
        await this.page.waitForLoadState('networkidle');
    }
}
export default LoginPage;