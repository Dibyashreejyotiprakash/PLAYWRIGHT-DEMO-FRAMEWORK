import { test } from '@playwright/test';
import Base from '../../../../Initiate/Base.js';
import ValidateLoginPage from '../../../../PageObjects/ValidateLoginPage.js';
import Interaction from '../../../../Utility/UIInteraction/Interaction.js';
import Test from '../../../../Utility/ReportUtility/TestLogger.js';
import testdata from '../../../../Testdata/smoketestdata.json' with { type: 'json' };

const base = new Base();
let validateLoginPage = null;
let interaction = null;

test.describe('Validate Login Feature', () => {
    test.beforeAll(async () => {
        Test.Log.Info('Launching browser and opening OrangeHRM login page');
        await base.launchBrowser();
        await base.launchapplication();

        validateLoginPage = new ValidateLoginPage(base.page);
        interaction = new Interaction(base.page);
    });

    test.afterAll(async () => {
        Test.Log.Info('Closing browser session');
        if (base.context) {
            await base.context.close();
        }

        if (base.browser) {
            await base.browser.close();
        }
    });

    test('Validate login flow and PIM access', async () => {
        try {
            const username = process.env.UN || testdata.credentials.username;
            const password = process.env.PWD || testdata.credentials.password;

            if (!username || !password) {
                throw new Error('Username or password not found. Check .env file or testdata JSON.');
            }

            Test.Log.Info(`Using username: ${username}`);
            await validateLoginPage.login(username, password);
            await validateLoginPage.validateDashboardPage();
            await validateLoginPage.validatePIMTab();

            Test.Log.Pass('Validate login feature completed successfully');
        } catch (error) {
            await Test.Log.Fail('Validate login feature failed', error.message, base.page);
            throw error;
        }
    });
});
