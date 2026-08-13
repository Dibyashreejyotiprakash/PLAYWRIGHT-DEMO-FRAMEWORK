import {test,expect} from "@playwright/test"
import Interaction from "../Utility/UIInteraction/Interaction";
import Test from "../Utility/ReportUtility/TestLogger";

class LoginPage{
    constructor(page){
        this.page = page;
        this.interaction = new Interaction(page)
        this.usernameInput = "[name='username']"
        this.passwordInput = "[name='password']"
        this.loginButton = "button[type='submit']"
    }
    
    async login(username,password){

        try{
            Test.log.info("Enter username in login page")
            await this.interaction.FillInputField(this.usernameInput,username)

            Test.log.info("Enter password in login page")
            await this.interaction.FillInputField(this.passwordInput,password)

            Test.log.info("varify login button is enabled")
            await this.interaction.AssertElementEnabled(this.loginButton)

            Test.log.info("Enter login button in login page")
            await this.interaction.ClickOnElement(this.loginButton)

            Test.log.info("wait for page to load after login")
            await this.interaction.waitforLoadState('load')

            Test.log.info("verify url after login")
            await this.interaction.AssertCurrentUrl("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index")

        }
        catch(error){
            Test.log.info("login action failed",error.message,this.page)
            console.log(`Login failed due to ${error}`);
            throw error


        }

    }
}
export default LoginPage;