import fs from 'fs';
import path from 'path';

class PageUrl {
    constructor() {
        this.pageUrlData = null;
    }

    /**
     * Load page URL data from JSON file
     * @returns {Object} - Page URL data
     */
    async loadPageUrlData() {
        try {
            if (!this.pageUrlData) {
                const jsonPath = path.resolve('./Testdata/pageurl.json');
                const fileContent = fs.readFileSync(jsonPath, 'utf-8');
                this.pageUrlData = JSON.parse(fileContent);
            }
            return this.pageUrlData;
        } catch (error) {
            console.error(`Failed to load page URL data: ${error.message}`);
            throw error;
        }
    }

    /**
     * Read URL value from page URL JSON
     * @param {string} key - The key to read from JSON
     * @returns {string} - The URL value
     */
    async readPageUrlValue(key) {
        try {
            await this.loadPageUrlData();

            if (!this.pageUrlData[key]) {
                throw new Error(`Key '${key}' not found in pageurl.json`);
            }

            return this.pageUrlData[key];
        } catch (error) {
            console.error(`Failed to read page URL value for key '${key}': ${error.message}`);
            throw error;
        }
    }

    // QA URLs
    async QA_SearchPageUrl(env) {
        try {
            let qa_searchpageurl = '';

            if (env.toLowerCase() === 'prod') {
                qa_searchpageurl = await this.readPageUrlValue('QA_SearchPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                qa_searchpageurl = await this.readPageUrlValue('QA_SearchPage_Stage');
            }

            return qa_searchpageurl;
        } catch (error) {
            console.error(`Failed to get QA Search Page URL: ${error.message}`);
            throw error;
        }
    }

    async QA_KeyWordSearchPageUrl(env) {
        try {
            let qa_keywordsearchpageurl = '';

            if (env.toLowerCase() === 'prod') {
                qa_keywordsearchpageurl = await this.readPageUrlValue('QA_KeyWorkSearchPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                qa_keywordsearchpageurl = await this.readPageUrlValue('QA_KeyWorkSearchPage_Stage');
            }

            return qa_keywordsearchpageurl;
        } catch (error) {
            console.error(`Failed to get QA Keyword Search Page URL: ${error.message}`);
            throw error;
        }
    }

    async QA_PDPPageUrl(env) {
        try {
            let qa_pdppageurl = '';

            if (env.toLowerCase() === 'prod') {
                qa_pdppageurl = await this.readPageUrlValue('QA_PDPPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                qa_pdppageurl = await this.readPageUrlValue('QA_PDPPage_Stage');
            }

            return qa_pdppageurl;
        } catch (error) {
            console.error(`Failed to get QA PDP Page URL: ${error.message}`);
            throw error;
        }
    }

    async QA_WorkCenterPageUrl(env) {
        try {
            let qa_workcenterpageurl = '';

            if (env.toLowerCase() === 'prod') {
                qa_workcenterpageurl = await this.readPageUrlValue('QA_WorkcenterPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                qa_workcenterpageurl = await this.readPageUrlValue('QA_WorkcenterPage_Stage');
            }

            return qa_workcenterpageurl;
        } catch (error) {
            console.error(`Failed to get QA WorkCenter Page URL: ${error.message}`);
            throw error;
        }
    }

    async QA_CartPageUrl(env) {
        try {
            let qa_cartpageurl = '';

            if (env.toLowerCase() === 'prod') {
                qa_cartpageurl = await this.readPageUrlValue('QA_CartPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                qa_cartpageurl = await this.readPageUrlValue('QA_CartPage_Stage');
            }

            return qa_cartpageurl;
        } catch (error) {
            console.error(`Failed to get QA Cart Page URL: ${error.message}`);
            throw error;
        }
    }

    // Amfam URLs
    async Amfam_SearchPageUrl(env) {
        try {
            let amfam_searchpageurl = '';

            if (env.toLowerCase() === 'prod') {
                amfam_searchpageurl = await this.readPageUrlValue('Amfam_SearchPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                amfam_searchpageurl = await this.readPageUrlValue('Amfam_SearchPage_Stage');
            }

            return amfam_searchpageurl;
        } catch (error) {
            console.error(`Failed to get Amfam Search Page URL: ${error.message}`);
            throw error;
        }
    }

    async Amfam_KeyWordSearchPageUrl(env) {
        try {
            let amfam_keywordsearchpageurl = '';

            if (env.toLowerCase() === 'prod') {
                amfam_keywordsearchpageurl = await this.readPageUrlValue('Amfam_KeyWorkSearchPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                amfam_keywordsearchpageurl = await this.readPageUrlValue('Amfam_KeyWorkSearchPage_Stage');
            }

            return amfam_keywordsearchpageurl;
        } catch (error) {
            console.error(`Failed to get Amfam Keyword Search Page URL: ${error.message}`);
            throw error;
        }
    }

    async Amfam_WorkCenterPageUrl(env) {
        try {
            let amfam_workcenterpageurl = '';

            if (env.toLowerCase() === 'prod') {
                amfam_workcenterpageurl = await this.readPageUrlValue('Amfam_WorkcenterPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                amfam_workcenterpageurl = await this.readPageUrlValue('Amfam_WorkcenterPage_Stage');
            }

            return amfam_workcenterpageurl;
        } catch (error) {
            console.error(`Failed to get Amfam WorkCenter Page URL: ${error.message}`);
            throw error;
        }
    }

    async Amfam_PDPPageUrl(env) {
        try {
            let amfam_pdppageurl = '';

            if (env.toLowerCase() === 'prod') {
                amfam_pdppageurl = await this.readPageUrlValue('Amfam_PDPPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                amfam_pdppageurl = await this.readPageUrlValue('Amfam_PDPPage_Stage');
            }

            return amfam_pdppageurl;
        } catch (error) {
            console.error(`Failed to get Amfam PDP Page URL: ${error.message}`);
            throw error;
        }
    }

    async Amfam_PLPPageUrl(env) {
        try {
            let amfam_plppageurl = '';

            if (env.toLowerCase() === 'prod') {
                amfam_plppageurl = await this.readPageUrlValue('Amfam_PLPPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                amfam_plppageurl = await this.readPageUrlValue('Amfam_PLPPage_Stage');
            }

            return amfam_plppageurl;
        } catch (error) {
            console.error(`Failed to get Amfam PLP Page URL: ${error.message}`);
            throw error;
        }
    }

    async Amfam_CartPageUrl(env) {
        try {
            let amfam_cartpageurl = '';

            if (env.toLowerCase() === 'prod') {
                amfam_cartpageurl = await this.readPageUrlValue('Amfam_CartPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                amfam_cartpageurl = await this.readPageUrlValue('Amfam_CartPage_Stage');
            }

            return amfam_cartpageurl;
        } catch (error) {
            console.error(`Failed to get Amfam Cart Page URL: ${error.message}`);
            throw error;
        }
    }

    async Amfam_ManageQRCodePageUrl(env) {
        try {
            let amfam_manageqrcodepageurl = '';

            if (env.toLowerCase() === 'prod') {
                amfam_manageqrcodepageurl = await this.readPageUrlValue('Amfam_ManageQrCodePage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                amfam_manageqrcodepageurl = await this.readPageUrlValue('Amfam_ManageQrCodePage_Stage');
            }

            return amfam_manageqrcodepageurl;
        } catch (error) {
            console.error(`Failed to get Amfam Manage QR Code Page URL: ${error.message}`);
            throw error;
        }
    }

    async Amfam_CreateQRCodeTypePageUrl(env) {
        try {
            let amfam_createqrcodetypepageurl = '';

            if (env.toLowerCase() === 'prod') {
                amfam_createqrcodetypepageurl = await this.readPageUrlValue('Amfam_CreateQrCodeTypes_Prod');
            } else if (env.toLowerCase() === 'stage') {
                amfam_createqrcodetypepageurl = await this.readPageUrlValue('Amfam_CreateQrCodeTypes_Stage');
            }

            return amfam_createqrcodetypepageurl;
        } catch (error) {
            console.error(`Failed to get Amfam Create QR Code Type Page URL: ${error.message}`);
            throw error;
        }
    }

    // StateFarm URLs
    async StateFarm_SearchPageUrl(env) {
        try {
            let sf_searchpageurl = '';

            if (env.toLowerCase() === 'prod') {
                sf_searchpageurl = await this.readPageUrlValue('SF_SearchPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                sf_searchpageurl = await this.readPageUrlValue('SF_SearchPage_Stage');
            }

            return sf_searchpageurl;
        } catch (error) {
            console.error(`Failed to get StateFarm Search Page URL: ${error.message}`);
            throw error;
        }
    }

    async StateFarm_KeyWordSearchPageUrl(env) {
        try {
            let sf_keywordsearchpageurl = '';

            if (env.toLowerCase() === 'prod') {
                sf_keywordsearchpageurl = await this.readPageUrlValue('SF_KeyWorkSearchPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                sf_keywordsearchpageurl = await this.readPageUrlValue('SF_KeyWorkSearchPage_Stage');
            }

            return sf_keywordsearchpageurl;
        } catch (error) {
            console.error(`Failed to get StateFarm Keyword Search Page URL: ${error.message}`);
            throw error;
        }
    }

    async StateFarm_WorkCenterPageUrl(env) {
        try {
            let sf_workcenterpageurl = '';

            if (env.toLowerCase() === 'prod') {
                sf_workcenterpageurl = await this.readPageUrlValue('SF_WorkcenterPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                sf_workcenterpageurl = await this.readPageUrlValue('SF_WorkcenterPage_Stage');
            }

            return sf_workcenterpageurl;
        } catch (error) {
            console.error(`Failed to get StateFarm WorkCenter Page URL: ${error.message}`);
            throw error;
        }
    }

    async StateFarm_PDPPageUrl(env) {
        try {
            let sf_pdppageurl = '';

            if (env.toLowerCase() === 'prod') {
                sf_pdppageurl = await this.readPageUrlValue('SF_PDPPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                sf_pdppageurl = await this.readPageUrlValue('SF_PDPPage_Stage');
            }

            return sf_pdppageurl;
        } catch (error) {
            console.error(`Failed to get StateFarm PDP Page URL: ${error.message}`);
            throw error;
        }
    }

    async StateFarm_PLPPageUrl(env) {
        try {
            let sf_plppageurl = '';

            if (env.toLowerCase() === 'prod') {
                sf_plppageurl = await this.readPageUrlValue('SF_PLPPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                sf_plppageurl = await this.readPageUrlValue('SF_PLPPage_Stage');
            }

            return sf_plppageurl;
        } catch (error) {
            console.error(`Failed to get StateFarm PLP Page URL: ${error.message}`);
            throw error;
        }
    }

    async StateFarm_CartPageUrl(env) {
        try {
            let sf_cartpageurl = '';

            if (env.toLowerCase() === 'prod') {
                sf_cartpageurl = await this.readPageUrlValue('SF_CartPage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                sf_cartpageurl = await this.readPageUrlValue('SF_CartPage_Stage');
            }

            return sf_cartpageurl;
        } catch (error) {
            console.error(`Failed to get StateFarm Cart Page URL: ${error.message}`);
            throw error;
        }
    }

    async StateFarm_ManageQRCodePageUrl(env) {
        try {
            let sf_manageqrcodepageurl = '';

            if (env.toLowerCase() === 'prod') {
                sf_manageqrcodepageurl = await this.readPageUrlValue('SF_ManageQrCodePage_Prod');
            } else if (env.toLowerCase() === 'stage') {
                sf_manageqrcodepageurl = await this.readPageUrlValue('SF_ManageQrCodePage_Stage');
            }

            return sf_manageqrcodepageurl;
        } catch (error) {
            console.error(`Failed to get StateFarm Manage QR Code Page URL: ${error.message}`);
            throw error;
        }
    }

    async StateFarm_CreateQRCodeTypePageUrl(env) {
        try {
            let sf_createqrcodetypepageurl = '';

            if (env.toLowerCase() === 'prod') {
                sf_createqrcodetypepageurl = await this.readPageUrlValue('SF_CreateQrCodeTypes_Prod');
            } else if (env.toLowerCase() === 'stage') {
                sf_createqrcodetypepageurl = await this.readPageUrlValue('SF_CreateQrCodeTypes_Stage');
            }

            return sf_createqrcodetypepageurl;
        } catch (error) {
            console.error(`Failed to get StateFarm Create QR Code Type Page URL: ${error.message}`);
            throw error;
        }
    }
}

export default PageUrl;
