import Interaction from '../Utility/UIInteraction/Interaction.js';
import Test from '../Utility/ReportUtility/TestLogger.js';

class ValidateLoginPage {
    constructor(page) {
        this.page = page;
        this.interaction = new Interaction(page);

        this.usernameInput = page.getByPlaceholder('Username').or(page.locator('input[name="username"]'));
        this.passwordInput = page.getByPlaceholder('Password').or(page.locator('input[name="password"]'));
        this.loginButton = page.getByRole('button', { name: 'Login' }).or(page.locator('button[type="submit"]'));
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' }).or(page.locator('h6.oxd-topbar-header-breadcrumb-module'));
        this.pimMenu = page.getByRole('link', { name: 'PIM' }).or(page.locator('a[href*="/pim/viewEmployeeList"]'));
    }

    async login(username, password) {
        try {
            Test.Log.Info('Entering username');
            await this.interaction.FillInputField(this.usernameInput, username);

            Test.Log.Info('Entering password');
            await this.interaction.FillInputField(this.passwordInput, password);

            Test.Log.Info('Validating login button state');
            await this.interaction.AssertElementEnabled(this.loginButton);

            Test.Log.Info('Clicking Login button');
            await this.interaction.ClickOnElement(this.loginButton);

            await this.interaction.waitforLoadState('networkidle', 30000);
            Test.Log.Pass('Login action completed successfully');
        } catch (error) {
            Test.Log.Error('Login action failed', error.message, this.page);
            throw error;
        }
    }

    async validateDashboardPage() {
        try {
            await this.interaction.AssertElementVisible(this.dashboardHeading);
            const currentUrl = await this.interaction.getCurrentUrl();
            const pageTitle = await this.interaction.getTitle();

            if (!currentUrl.includes('/dashboard/index')) {
                throw new Error(`Dashboard URL validation failed. Actual URL: ${currentUrl}`);
            }

            if (!pageTitle.includes('OrangeHRM')) {
                throw new Error(`Dashboard title validation failed. Actual title: ${pageTitle}`);
            }

            Test.Log.Pass('Dashboard page validated successfully', {
                url: currentUrl,
                title: pageTitle
            }, this.page);
        } catch (error) {
            Test.Log.Error('Dashboard validation failed', error.message, this.page);
            throw error;
        }
    }

    async validatePIMTab() {
        try {
            await this.interaction.AssertElementVisible(this.pimMenu);
            await this.interaction.ClickOnElement(this.pimMenu);
            await this.interaction.waitforLoadState('networkidle', 30000);

            const currentUrl = await this.interaction.getCurrentUrl();
            if (!currentUrl.includes('/pim/viewEmployeeList')) {
                throw new Error(`PIM tab validation failed. Actual URL: ${currentUrl}`);
            }

            Test.Log.Pass('PIM tab navigation validated successfully', {
                url: currentUrl
            }, this.page);
        } catch (error) {
            Test.Log.Error('PIM tab validation failed', error.message, this.page);
            throw error;
        }
    }
}

export default ValidateLoginPage;
