import pageurl from '../../../Testdata/pageurl.json';

class ReadPageUrl{

    async getUrl(){
        try{
            let url = pageurl.QA_Prod;
            console.log("URL: " + url);
            return url;
      }
        catch(error){
            console.log("Error in getUrl method of ReadPageUrl class: " + error);
        }
    }

}
export default ReadPageUrl;