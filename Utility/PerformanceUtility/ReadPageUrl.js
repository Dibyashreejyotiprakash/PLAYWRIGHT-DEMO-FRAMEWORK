import fs from 'fs';
import path from 'path';

class ReadPageUrl {
    /**
     * Read page URLs from page.json file based on environment
     * @param {string} pageName - The page key name (e.g., 'QA_SearchPage_Prod')
     * @param {string} env - Environment (qa, stage, prod). Defaults to process.env.environment
     * @returns {string} - The page URL
     */
    static async getPageUrl(pageName, env = null) {
        try {
            // Use provided env or fall back to environment variable
            const environment = env || process.env.environment || 'qa';

            // Read the page.json file
            const jsonPath = path.resolve('./Testdata/pageurl.json');
            const fileContent = fs.readFileSync(jsonPath, 'utf-8');
            const pageData = JSON.parse(fileContent);

            // Build the key based on environment
            let key = pageName;

            // If pageName doesn't include environment prefix, construct it
            if (!pageName.includes('_')) {
                const envPrefix = environment.toUpperCase();
                key = `${envPrefix}_${pageName}`;
            }

            // Get the URL from the JSON data
            const url = pageData[key];

            if (!url) {
                throw new Error(`Page URL not found for key: ${key}`);
            }

            return url;

        } catch (error) {
            console.error(`Failed to read page URL: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get all page URLs for a specific environment
     * @param {string} env - Environment (qa, stage, prod)
     * @returns {Object} - Object containing all page URLs for the environment
     */
    static async getAllPageUrls(env = null) {
        try {
            const environment = env || process.env.environment || 'qa';

            // Read the page.json file
            const jsonPath = path.resolve('./Testdata/pageurl.json');
            const fileContent = fs.readFileSync(jsonPath, 'utf-8');
            const pageData = JSON.parse(fileContent);

            // Filter URLs based on environment prefix
            const envPrefix = environment.toUpperCase();
            const filteredUrls = {};

            for (const [key, value] of Object.entries(pageData)) {
                if (key.startsWith(envPrefix)) {
                    filteredUrls[key] = value;
                }
            }

            if (Object.keys(filteredUrls).length === 0) {
                throw new Error(`No URLs found for environment: ${environment}`);
            }

            return filteredUrls;

        } catch (error) {
            console.error(`Failed to read all page URLs: ${error.message}`);
            throw error;
        }
    }
}

export default ReadPageUrl;
