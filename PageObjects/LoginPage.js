import {test, expect} from '@playwright/test';
import Interaction from '../Utility/UIInteraction/Interaction.js';
import Test from '../Utility/ReportUtility/TestLogger.js';

class LoginPage {

        constructor(page) {
            this.page = page;
            this.interaction = new Interaction(page);
            this.usernameInput = page.getByPlaceholder('Username');
            this.passwordInput = page.getByPlaceholder('Password');
            this.loginButton = page.getByRole('button', { name: 'Login' });
        }


    async login(username, password) {

        try{
            Test.Log.Info('Entering username in login form');
            await this.interaction.FillInputField(this.usernameInput,username);

            Test.Log.Info('Entering password in login form');
            await this.interaction.FillInputField(this.passwordInput,password);

            Test.Log.Info('Verifying login button is enabled');
            await this.interaction.AssertElementEnabled(this.loginButton);

            Test.Log.Info('Clicking on login button');
            await this.interaction.ClickOnElement(this.loginButton);

            Test.Log.Info('Waiting for page to load after login');
            await this.interaction.waitforLoadState('load');

            Test.Log.Pass('Login action completed successfully', null, this.page);
        }
        catch(error){
            Test.Log.Error('Login action failed', error.message, this.page);
            console.log(`Login failed due to ${error}`);
            throw error;
        }

    }
}
export default LoginPage;