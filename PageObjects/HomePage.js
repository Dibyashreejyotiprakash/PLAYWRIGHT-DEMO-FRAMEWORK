import {test,expect} from "@playwright/test";
import Interaction from '../Utility/UIInteraction/Interaction';
import Test from '../Utility/ReportUtility/TestLogger';



class HomePage{



    constructor(page){
        this.page = page;
        this.interaction = new Interaction(page);
        this.pim = page.getByText('PIM')
    }


    async ClickOnPIM(){
        try{
            await this.interaction.ClickOnElement(this.pim);
            Test.Log.Info("Clicked On PIM Buttom");
        }
        catch(error){
            console.log("Click on PIM failed due to ",error);
            Test.Log.Error("ClickOnPIM failed due to ", error);
        }
    }


}
export default HomePage;