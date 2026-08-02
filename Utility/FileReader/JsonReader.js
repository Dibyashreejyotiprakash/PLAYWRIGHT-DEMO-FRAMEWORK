import fs from "fs";

export default class ReadJson {

    /**
     * Read complete JSON body
     * @param {string} filePath
     * @returns {Object}
     */
    static ReadJsonBody(filePath) {
        try {
            const jsonData = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(jsonData);
        }
        catch (error) {
            throw new Error(`Unable to read JSON file : ${error.message}`);
        }
    }

    /**
     * Get value using key (Top level)
     * @param {string} filePath
     * @param {string} key
     * @returns {any}
     */
    static GetValue(filePath, key) {
        const json = this.ReadJsonBody(filePath);

        if (!(key in json)) {
            throw new Error(`Key '${key}' not found.`);
        }

        return json[key];
    }

    /**
     * Get nested value using dot notation
     * Example:
     * user.address.city
     * login.credentials.username
     *
     * @param {string} filePath
     * @param {string} keyPath
     * @returns {any}
     */
    static GetNestedValue(filePath, keyPath) {

        const json = this.ReadJsonBody(filePath);

        const keys = keyPath.split(".");

        let result = json;

        for (const key of keys) {

            if (result && key in result) {
                result = result[key];
            }
            else {
                throw new Error(`Key path '${keyPath}' not found.`);
            }

        }

        return result;
    }

}